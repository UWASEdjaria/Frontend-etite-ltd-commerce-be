import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  price: z.coerce.number().positive("Price must be > 0"),
  categoryId: z
    .string()
    .min(1, "Category is required"),
  condition: z
    .enum(["NEW", "REFURBISHED", "HEAVY_DUTY"])
    .optional(),
});

export type ProductFormValues = z.infer<typeof createProductSchema>;

