import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

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

export default router;