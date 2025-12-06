import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseJwt } from "@/lib/utils";

// GET: Lấy danh sách tất cả locations
export async function GET(request: NextRequest) {
  try {
    const locations = await prisma.location.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: locations,
      count: locations.length,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
interface AuthPayload {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: { roles: string[] };
  resource_access: Record<string, { roles: string[] }>;
  scope: string;
  email_verified: false;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

// POST: Tạo location mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!request.headers.get("Authorization")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const apiToken = request.headers.get("Authorization")?.replace("Bearer ", "");
    const {
      sub: fId,
      preferred_username: name,
      email,
    }: AuthPayload = parseJwt(apiToken || "").payload;

    const { latitude, longitude, deviceName, brand, modelId, modelName, totalMemory } = body;
    // Validate required fields
    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, latitude, longitude" },
        { status: 400 }
      );
    }

    let finalUserId;

    // Nếu không có userId nhưng có email, tìm hoặc tạo user
    if (fId) {
      let user = await prisma.user.findFirst({
        where: { f_id: fId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            f_id: fId,
            email: email,
            name: name,
          },
        });
      }

      finalUserId = user.id;
    }

    // Tạo location mới
    const location = await prisma.location.create({
      data: {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: finalUserId || null,
        deviceName,
        brand,
        modelId,
        modelName,
        totalMemory,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: location,
        message: "Location created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create location" },
      { status: 500 }
    );
  }
}
