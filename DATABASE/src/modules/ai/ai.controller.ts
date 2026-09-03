import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import {
  streamAIResponse,
  generateStylistRecommendations,
  searchAIProducts,
  analyzeProduct,
} from "./ai.service.js";

export class AIController {
  testAI = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await streamAIResponse({ prompt: req.body.prompt as string });

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("X-Content-Type-Options", "nosniff");

      for await (const chunk of result.textStream) {
        res.write(chunk);
      }

      res.end();
    } catch (error) {
      next(error);
    }
  });

  generateStylistRecommendations = asyncHandler(async (req: Request, res: Response) => {
    const recommendations = await generateStylistRecommendations(req.body);

    ApiResponse.success(
      res,
      200,
      "AI outfit recommendations generated successfully.",
      recommendations
    );
  });

  searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const searchResult = await searchAIProducts(req.body);

    ApiResponse.success(
      res,
      200,
      searchResult.count > 0
        ? "Products found successfully."
        : "No products currently match your request.",
      searchResult
    );
  });

  analyzeProduct = asyncHandler(async (req: Request, res: Response) => {
    const analysis = await analyzeProduct(req.body);

    ApiResponse.success(
      res,
      200,
      "Product analysed successfully.",
      analysis
    );
  });
}
