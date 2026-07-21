import { MediaRepository } from "./media.repository.js";
import { CreateMediaInput } from "./media.types.js";
import { ApiError } from "../../utils/api-error.js";

export class MediaService {
  private repository = new MediaRepository();

  async getAll(search?: string, folder?: string) {
    return this.repository.findAll(search, folder);
  }

  async create(data: CreateMediaInput) {
    if (!data.url || !data.filename) {
      throw new ApiError(400, "URL and filename are required");
    }
    return this.repository.create(data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
