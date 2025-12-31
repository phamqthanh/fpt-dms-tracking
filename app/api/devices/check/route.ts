import prisma from "@/lib/prisma";
import { createEndpoint } from "@/src/server/services/auth";

export const GET = createEndpoint(async (request) => {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!deviceId)
    return {
      success: false,
      error: "Missing required field: deviceId",
      status: 400,
    };

  // Tạo device mới
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
    },
  });
  const success = !!device;
  return { success, data: device, status: success ? 200 : 404 };
}, false);
