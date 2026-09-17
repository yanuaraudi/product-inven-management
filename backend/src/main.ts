import express from "express";
import type { Request, Response, NextFunction } from "express";
import productsRoute from "./routes/productRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/products", productsRoute);
app.use("/uploads", express.static("uploads"));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error Caught:", err);
    if (err.name === "MulterError" || err.status === 400) {
        return res.status(400).json({
            message: err.message,
        });
    }
    return res.status(500).json({
        message: "Internal server error",
    });
});

app.listen(3000, () => {
    console.log("Serve running on port 3000!");
});