import prisma from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import RefreshButton from "./refresh-button";

export default async function DeviceTable() {
  const startTime = Date.now();
  const devices = await prisma.device.findMany({
    include: {
      locations: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Lấy location gần nhất
      },
      _count: {
        select: { locations: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const duration = Date.now() - startTime;

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Devices List</h2>
          <p className="text-sm text-gray-500">
            Fetched {devices.length} devices in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-900/10">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold">Name</th>
                <th className="pb-3 text-sm font-semibold">Device name</th>
                <th className="pb-3 text-sm font-semibold">Model Id</th>
                <th className="pb-3 text-sm font-semibold">Model Name</th>
                <th className="pb-3 text-sm font-semibold">Total Memory</th>
                <th className="pb-3 text-sm font-semibold">Locations Count</th>
                <th className="pb-3 text-sm font-semibold">Last Location</th>
                <th className="pb-3 text-sm font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/5">
              {devices.map((device) => (
                <tr key={device.id} className="group hover:bg-white/20 transition-colors">
                  <td className="py-4">
                    <p className="font-medium">{device.name || "N/A"}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-700">{device.deviceName || "N/A"}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-700">{device.modelId || "N/A"}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-700">{device.modelName || "N/A"}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-700">{device.totalMemory || "N/A"}</p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                        {device._count.locations}
                      </span>
                      <span className="text-sm text-gray-500">locations</span>
                    </div>
                  </td>
                  <td className="py-4">
                    {device.locations.length > 0 ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{device.locations[0].id}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500 font-mono">
                            {device.locations[0].latitude.toFixed(4)},{" "}
                            {device.locations[0].longitude.toFixed(4)}
                          </p>
                          <a
                            href={`https://www.google.com/maps?q=${device.locations[0].latitude},${device.locations[0].longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No locations yet</p>
                    )}
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-600">{timeAgo(device.createdAt)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
