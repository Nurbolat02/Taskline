import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#64748b"),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// Extends categorySchema so the name/color rules aren't duplicated.
export const updateCategorySchema = categorySchema.extend({
  id: z.uuid(),
});

export const deleteCategorySchema = z.object({
  id: z.uuid(),
});
