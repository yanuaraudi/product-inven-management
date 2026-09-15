import { Router } from "express";
import prisma from "../lib/prisma.js";

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
    const product = await prisma.product.create({
        data: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
        },
    });

    res.status(201).json(product);
});

export default router;