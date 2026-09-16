import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
    stock: z.coerce.number().int().min(0, "Stock must be greater than or equal to 0"),
    category: z.string().optional(),
    imageUrl: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();