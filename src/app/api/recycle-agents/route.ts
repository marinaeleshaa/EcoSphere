import { NextRequest, NextResponse } from "next/server";
import { recycleAgents } from "./store";

/**
 * GET /api/recycle-agents
 * Fetch all recycle agents
 */
export async function GET(request: NextRequest) {
  try {
    // Convert map to array of agents
    const agents = Array.from(recycleAgents.values());
    
    console.log("[GET] Fetching agents. Store size:", recycleAgents.size);
    console.log("[GET] Agent IDs:", Array.from(recycleAgents.keys()));
    
    return NextResponse.json(
      {
        success: true,
        data: agents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recycle agents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch recycle agents",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recycle-agents
 * Create a new recycle agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phoneNumber", "birthDate", "type", "password"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate phone number format (01 + 9 digits = 11 total)
    const phoneStr = body.phoneNumber.toString();
    if (phoneStr.length !== 11 || !phoneStr.startsWith("01")) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must start with 01 and be exactly 11 digits",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAgent = Array.from(recycleAgents.values()).find(
      (agent) => agent.email === body.email
    );
    if (existingAgent) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    // Create new agent
    const newAgent = {
      _id: `agent-${Date.now()}`,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      phoneNumber: body.phoneNumber,
      birthDate: body.birthDate,
      type: body.type,
      isActive: body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    recycleAgents.set(newAgent._id, newAgent);

    console.log("[POST] Agent created:", newAgent._id);
    console.log("[POST] Total agents in store:", recycleAgents.size);

    return NextResponse.json(
      {
        success: true,
        message: "Recycle agent created successfully",
        data: newAgent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recycle agent:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create recycle agent",
      },
      { status: 500 }
    );
  }
}
