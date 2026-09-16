import { Router } from "express";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { createProductSchema, updateProductSchema } from "../schemas/productSchema.js";

const router = Router();

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

// GET PRODUCT BY ID
router.get("/:id", async (req, res) => {
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
})

// CREATE PRODUCT
router.post("/", async (req, res) => {
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
        },
    });

    res.status(201).json(product);
});

// UPDATE PRODUCT
router.patch("/:id", async (req, res) => {
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;