import { Router } from "express";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { createProductSchema, updateProductSchema } from "../schemas/productSchema.js";
import upload from "../middleware/upload.js";
import fs from "node:fs/promises";

const router = Router();

// GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
          where: {
            ...(req.query.category ? { category: req.query.category as string } : {}),
          }
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
});

// GET PRODUCT BY ID
router.get("/:id", async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
        where: {
            id: req.params.id
        }
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
    } catch (error) {
        next(error);
    }
});

// CREATE PRODUCT
router.post("/", async (req, res, next) => {
    try {
        const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid request body",
            error: result.error.flatten().fieldErrors,
        });
    }

    const product = await prisma.product.create({
        data: {
            name: result.data.name,
            description: result.data.description ?? null,
            price: result.data.price,
            stock: result.data.stock,
            category: result.data.category ?? null,
            status: result.data.status ?? null,
        },
    });

    res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

// UPDATE PRODUCT
router.patch("/:id", async (req, res, next) => {
  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: result.error.flatten().fieldErrors
    });
  }

  try {
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: result.data,
    });

    res.json(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    next(error);
  }
});

// INCREMENT STOCK PRODUCT
router.patch("/stock/increment/:id", async (req, res, next) => {
  try {
        const product = await prisma.product.findUnique({
        where: {
            id: req.params.id
        }
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const stock = product.stock + 1;

    const updateProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        stock: stock
      },
    });
     res.json(updateProduct);
    } catch (error) {
        next(error);
    }
})

// DECREMENT STOCK PRODUCT
router.patch("/stock/decrement/:id", async (req, res, next) => {
  try {
        const product = await prisma.product.findUnique({
        where: {
            id: req.params.id
        }
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    if(product.stock <= 0) {
      return res.status(400).json({
        message: "Stock cannot be less than 0"
      });
    }

    const stock = product.stock - 1;

    const updateProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        stock: stock
      },
    });
     res.json(updateProduct);
    } catch (error) {
        next(error);
    }
})


// DELETE PRODUCT
router.delete("/:id", async (req, res, next) => {
    try {
        const product = await prisma.product.delete({
            where: { id: req.params.id, },
        });

        if (product.imageUrl) {
            const imagePath = product.imageUrl.replace("/uploads/", "uploads/");
            await fs.unlink(imagePath).catch(() => {});
        }

        return res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return res.status(404).json({ message: "Product not found" });
        }
        next(error);
    }
});

// POST UPLOAD IMAGE PRODUCT
router.post("/:id/image", upload.single("image"), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            message: "image file is required",
        });
    }

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id as string,
            },
        });

        if (!product) {
            await fs.unlink(req.file.path).catch(() => {});
            return res.status(404).json({
                message: "Product not found",
            });
        }
        
        const oldImageUrl = product.imageUrl;
        const imageUrl = `/uploads/${req.file.filename}`;
        const updateProduct = await prisma.product.update({
            where: {
                id: req.params.id as string,
            },
            data: {
                imageUrl: imageUrl,
            },
        });

        if (oldImageUrl) {
            const oldImagePath = oldImageUrl.replace("/uploads/", "uploads/");

            await fs.unlink(oldImagePath).catch(() => {});
        }

        return res.status(200).json(updateProduct);
    } catch (error) {
        await fs.unlink(req.file.path).catch(() => {});
        next(error);
    }
});

export default router;