import { ReferenceRepository } from "./reference.repository.js";

export class ReferenceService {
  private repository = new ReferenceRepository();

  async getAttributes() {
    return this.repository.getAttributes();
  }

  async getColors() {
    return this.repository.getColors();
  }

  async getSizes() {
    return this.repository.getSizes();
  }

  async getLocations() {
    return this.repository.getLocations();
  }
}
