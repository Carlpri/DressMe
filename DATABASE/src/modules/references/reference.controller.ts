import { ReferenceService } from "./reference.service.js";

export class ReferenceController {
  private service = new ReferenceService();

  getAttributes = async (req: any, res: any) => {
    const attributes = await this.service.getAttributes();
    res.json(attributes);
  };

  getColors = async (req: any, res: any) => {
    const colors = await this.service.getColors();
    res.json(colors);
  };

  getSizes = async (req: any, res: any) => {
    const sizes = await this.service.getSizes();
    res.json(sizes);
  };

  getLocations = async (req: any, res: any) => {
    const locations = await this.service.getLocations();
    res.json(locations);
  };
}
