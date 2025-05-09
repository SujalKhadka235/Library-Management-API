import { Response } from "express";
import { z } from "zod";
import { assignCategoryToBookService } from "../../service/books/assignCategoryToBook.service.js";
import { getBookById } from "../../service/books/getBookbyId.service.js";
const assignCategorytoBookSchema = z.object({
  category: z.string().min(1, "category must be at least one character long"),
});
export const assignCategoryToBook = async (
  req: any,
  res: Response
): Promise<void> => {
  const parsed = assignCategorytoBookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ msg: "invalid request" });
    return;
  }
  try {
    const bookIdFromParams = Number(req.params.id);
    if (isNaN(bookIdFromParams)) {
      res.status(400).json({ msg: "Invalid book ID" });
      return;
    }
    const author_id = req.author?._author_id;
    const book = await getBookById(bookIdFromParams);
    if (book.authorId !== author_id) {
      res.status(403).json({
        msg: "You are unauthorized to assign a category to this book",
      });
      return;
    }
    const { category } = parsed.data;
    await assignCategoryToBookService(bookIdFromParams, category);
    res.status(200).json({ msg: "Category has been assigned to the book" });
  } catch (err: any) {
    res.status(500).json({ err: err.message });
    return;
  }
};
