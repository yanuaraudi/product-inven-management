import express from "express";
import productsRoute from "./routes/productRoutes.js";

const app = express();

app.use("/products", productsRoute);

app.listen(3000, () => {
    console.log("Serve running on port 3000!");
});