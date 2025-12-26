import { NextRequest } from "next/server";
import { rootContainer } from "@/backend/config/container";
import { RecycleController } from "@/backend/features/recycle/recycle.controller";
import { ok, serverError } from "@/types/api-helpers";
import {
  mapFromRawDataToRecyeleRequest,
  RecycleRequest,
  RecycleRowData,
} from "@/backend/features/recycle/recycle.types";

export const GET = async () => {
  try {
    const response = await rootContainer
      .resolve(RecycleController)
      .listRecycleEntries();
    return ok(response);
  } catch (error) {
    console.error(error);
    return serverError("can't save recycle request");
  }
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as RecycleRowData;
  try {
    const response = await rootContainer
      .resolve(RecycleController)
      .createRecycleEntry(mapFromRawDataToRecyeleRequest(data));
    return ok(response);
  } catch (error) {
    console.error(error);
    return serverError("can't save recycle request");
  }
};

export const PATCH = async (req: NextRequest) => {
  const data = (await req.json()) as RecycleRequest;

  try {
    const response = await rootContainer
      .resolve(RecycleController)
      .updateRecycleEntry(`${data._id}`, data);
    return ok(response);
  } catch (error) {
    console.error(error);
    return serverError("can't update recycle request");
  }
};
