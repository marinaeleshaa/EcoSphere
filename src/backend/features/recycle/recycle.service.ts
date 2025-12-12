import { inject, injectable } from "tsyringe";
import { type IRecycleRepository } from "./recycle.repository";
import { mapRecycleToResponse, RecycleResponse } from "./recycle.types";
import { IRecycle } from "./recycle.model";

export interface IRecycleService {
  createRecycleEntry(data: Partial<IRecycle>): Promise<RecycleResponse>;
  getRecycleEntryById(id: string): Promise<RecycleResponse>;
  updateRecycleEntry(
    id: string,
    data: Partial<IRecycle>
  ): Promise<RecycleResponse>;
  deleteRecycleEntry(id: string): Promise<RecycleResponse>;
  listRecycleEntries(): Promise<RecycleResponse[]>;
  analyzeImages(files: Blob[]): Promise<any>;
  calculateCarbonFootprint(items: any[]): Promise<number>;
}

@injectable()
export class RecycleService implements IRecycleService {
  constructor(
    @inject("RecycleRepository")
    private readonly recycleRepository: IRecycleRepository
  ) {}

  async createRecycleEntry(data: Partial<IRecycle>): Promise<RecycleResponse> {
    const response = await this.recycleRepository.createRecycleEntry(data);
    return mapRecycleToResponse(response);
  }

  async getRecycleEntryById(id: string): Promise<RecycleResponse> {
    const response = await this.recycleRepository.getRecycleEntryById(id);
    return mapRecycleToResponse(response);
  }

  async updateRecycleEntry(
    id: string,
    data: Partial<IRecycle>
  ): Promise<RecycleResponse> {
    const response = await this.recycleRepository.updateRecycleEntry(id, data);
    return mapRecycleToResponse(response);
  }

  async deleteRecycleEntry(id: string): Promise<RecycleResponse> {
    const response = await this.recycleRepository.deleteRecycleEntry(id);
    return mapRecycleToResponse(response);
  }

  async listRecycleEntries(): Promise<RecycleResponse[]> {
    const response = await this.recycleRepository.listRecycleEntries();
    const mappedData = response.map((item) => mapRecycleToResponse(item));
    return mappedData;
  }

  async analyzeImages(files: Blob[]): Promise<any> {
    const results = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        const response = await fetch(process.env.ROBOFLOW_WORKFLOW_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.ROBOFLOW_API_KEY,
            inputs: {
              image: { type: "base64", value: base64 },
            },
          }),
        });

        const data = await response.json();

        // Handle Workflow Response Structure (Array vs Object)
        const result = Array.isArray(data) ? data[0] : data;

        // Helper to find array of predictions recursively
        const findPredictions = (obj: any): any[] => {
          if (!obj || typeof obj !== "object") return [];
          if (Array.isArray(obj)) {
            if (obj.length > 0 && (obj[0].class || obj[0].class_id)) return obj;
            for (const item of obj) {
              const found = findPredictions(item);
              if (found.length > 0) return found;
            }
            return [];
          }
          if (obj.predictions && Array.isArray(obj.predictions)) {
            if (
              obj.predictions.length > 0 &&
              (obj.predictions[0].class || obj.predictions[0].class_id)
            )
              return obj.predictions;
            return findPredictions(obj.predictions);
          }
          for (const key in obj) {
            if (key === "video_metadata" || key === "visualization") continue;
            const found = findPredictions(obj[key]);
            if (found.length > 0) return found;
          }
          return [];
        };

        const preds = findPredictions(result);

        // Manual Counting since count_objects might be missing
        const counts: Record<string, number> = {};
        preds.forEach((p: any) => {
          const label = p.class || p.class_id;
          if (label) {
            counts[label] = (counts[label] || 0) + 1;
          }
        });

        return counts;
      })
    );

    const aggregatedCounts: Record<string, number> = {};
    results.forEach((res) => {
      Object.entries(res).forEach(([key, val]) => {
        aggregatedCounts[key] = (aggregatedCounts[key] || 0) + (val as number);
      });
    });

    const items = Object.entries(aggregatedCounts).map(([key, count]) => {
      const mapping = WEIGHT_MAPPING[key] || { type: "Unknown", weight: 0 };
      const totalWeight = count * mapping.weight;

      return {
        originalLabel: key,
        type: mapping.type,
        count: count,
        estimatedWeight: parseFloat(totalWeight.toFixed(2)),
      };
    });

    const totalWeight = items.reduce(
      (sum, item) => sum + item.estimatedWeight,
      0
    );
    const estimatedCarbonSaved = await this.calculateCarbonFootprint(items);

    return {
      items,
      totalEstimatedWeight: parseFloat(totalWeight.toFixed(2)),
      estimatedCarbonSaved: parseFloat(estimatedCarbonSaved.toFixed(2)),
    };
  }

  async calculateCarbonFootprint(items: any[]): Promise<number> {
    let totalCO2 = 0;

    for (const item of items) {
      const type = item.type.toLowerCase();
      let activityId = "waste_type_mixed_recyclables-disposal_method_recycled"; // Fallback

      if (type.includes("plastic"))
        activityId = "waste_type_pet-disposal_method_recycled";
      if (type.includes("glass"))
        activityId = "waste_type_glass-disposal_method_recycled";
      if (type.includes("metal"))
        activityId = "waste_type_aluminum-disposal_method_recycled";
      if (type.includes("paper"))
        activityId = "waste_type_paper_cardboard-disposal_method_recycled";

      try {
        const response = await fetch("https://api.climatiq.io/estimate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emission_factor: {
              activity_id: activityId,
              data_version: "^29",
            },
            parameters: {
              weight: item.estimatedWeight,
              weight_unit: "kg",
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(
            `Climatiq API Error for ${type}: ${response.status} - ${errText}`
          );
          throw new Error("API_FAIL");
        }

        const data = await response.json();
        totalCO2 += data.co2e || 0;
      } catch (error) {
        // Fallback logic
        let factor = 1.0;
        if (type.includes("plastic")) factor = 2.5;
        else if (type.includes("metal")) factor = 9.0;
        else if (type.includes("glass")) factor = 0.6;
        totalCO2 += item.estimatedWeight * factor;
      }
    }

    return totalCO2;
  }
}

const WEIGHT_MAPPING: Record<string, { type: string; weight: number }> = {
  plastic_bottle: { type: "Plastic", weight: 0.05 },
  bottle: { type: "Plastic", weight: 0.05 }, // Generic bottle -> assume plastic
  can: { type: "Metal", weight: 0.015 },
  glass_bottle: { type: "Glass", weight: 0.3 },
  cardboard_box: { type: "Paper", weight: 0.2 },
  // Add more mappings as needed based on Roboflow model classes
};
