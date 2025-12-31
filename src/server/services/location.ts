import prisma from "@/lib/prisma";

export async function getIsRegistedDevice(id: string) {
  const item = await prisma.device.findFirst({ where: { id } });
  return !!item;
}
export async function registerDevice(data: {
  id: string;
  deviceName: string;
  brand: string;
  modelId: string;
  modelName: string;
}) {
  const item = await prisma.device.create({
    data: {
      brand: data.brand,
      deviceName: data.deviceName,
      id: data.id,
      modelId: data.modelId,
      modelName: data.modelName,
    },
  });
  return item;
}
