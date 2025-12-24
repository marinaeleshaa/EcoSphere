import { NextRequest, NextResponse } from "next/server";
import { recycleAgents } from "../store";

/**
 * PATCH /api/recycle-agents/:id
 * Update recycle agent status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log("[PATCH] Looking for agent:", id);
    console.log("[PATCH] Store size:", recycleAgents.size);
    console.log("[PATCH] Store keys:", Array.from(recycleAgents.keys()));

    const agent = recycleAgents.get(id);
    if (!agent) {
      console.log("[PATCH] Agent not found:", id);
      return NextResponse.json(
        {
          success: false,
          message: "Recycle agent not found",
        },
        { status: 404 }
      );
    }

    // Update only the fields that are provided
    const updatedAgent = {
      ...agent,
      ...body,
      updatedAt: new Date(),
    };

    recycleAgents.set(id, updatedAgent);

    console.log("[PATCH] Agent updated:", id);
    console.log("[PATCH] Updated agent:", updatedAgent);

    return NextResponse.json(
      {
        success: true,
        message: "Recycle agent updated successfully",
        data: updatedAgent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating recycle agent:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update recycle agent",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recycle-agents/:id
 * Delete a recycle agent
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const agent = recycleAgents.get(id);
    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          message: "Recycle agent not found",
        },
        { status: 404 }
      );
    }

    recycleAgents.delete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Recycle agent deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting recycle agent:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete recycle agent",
      },
      { status: 500 }
    );
  }
}
