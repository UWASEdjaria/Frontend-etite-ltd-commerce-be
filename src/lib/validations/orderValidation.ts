import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z.string().min(5, "Address must be at least 5 characters long"),
});