import { Request, Response, NextFunction } from "express";
import { MediaService } from "./media.service.js";

const service = new MediaService();

export class MediaController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const folder = req.query.folder as string | undefined;
      const items = await service.getAll(search, folder);
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const item = await service.create({
        ...req.body,
        createdBy: userId,
      });
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, NextFunction: NextFunction) {
    try {
      const id = req.params.id as string;
      await service.delete(id);
      res.json({ success: true, message: "Media item deleted successfully" });
    } catch (error) {
      NextFunction(error);
    }
  }
}
