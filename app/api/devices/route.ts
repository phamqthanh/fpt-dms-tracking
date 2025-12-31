import prisma from "@/lib/prisma";
import { createEndpoint } from "@/src/server/services/auth";

export const POST = createEndpoint(async (request) => {
  const body = await request.json();
  const { deviceId } = body;
  if (!deviceId)
    return {
      success: false,
      error: "Missing required field: deviceId",
      status: 400,
    };

  // Tạo device mới
  const device = await prisma.device.create({
    data: {
      brand: body.brand,
      deviceName: body.deviceName,
      modelId: body.modelId,
      modelName: body.modelName,
      id: deviceId,
    },
  });

  return { success: true, data: device, status: 201 };
}, false);
