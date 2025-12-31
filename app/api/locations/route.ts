import prisma from "@/lib/prisma";
import { createEndpoint } from "@/src/server/services/auth";
import { getUserId } from "@/src/server/services/user";
import { NextRequest } from "next/server";

export const GET = createEndpoint<{ limit: number; offset: number }>(async function (
  req,
  res,
  other
) {
  const { limit = 20, offset = 0 } = other.query ?? {};
  const locations = await prisma.location.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      device: { select: { id: true, modelName: true, deviceName: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: Number(limit),
    skip: Number(offset),
  });

  return {
    status: 200,
    success: true,
    data: locations,
    count: locations.length,
  };
},
false);

// POST: Tạo location mới
export const POST = createEndpoint(async function (request: NextRequest) {
  const body = await request.json();

  const apiToken = request.headers.get("Authorization")?.replace("Bearer ", "");
  const { latitude, longitude, deviceId } = body;
  // Validate required fields
  if (latitude === undefined || longitude === undefined) {
    return {
      success: false,
      error: "Missing required fields: latitude, longitude",
      status: 400,
    };
  }

  const userId = await getUserId(apiToken || "");

  // Tạo location mới
  const location = await prisma.location.create({
    data: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      userId,
      deviceId,
    },
  });

  return {
    success: true,
    data: location,
    message: "Location created successfully",
    status: 201,
  };
}, false);
