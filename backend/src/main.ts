import express from "express";
import productsRoute from "./routes/productRoutes.js";

const app = express();

app.use(express.json());
app.use("/products", productsRoute);
app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
    console.log("Serve running on port 3000!");
});