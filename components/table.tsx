import prisma from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import RefreshButton from "./refresh-button";

export default async function Table() {
  const startTime = Date.now();
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
      createdAt: 'desc',
    },
  });
  const duration = Date.now() - startTime;

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">User Locations Tracking</h2>
          <p className="text-sm text-gray-500">
            Fetched {locations.length} locations in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>
      
      {locations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No locations tracked yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-900/10">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold">Location Name</th>
                <th className="pb-3 text-sm font-semibold">User</th>
                <th className="pb-3 text-sm font-semibold">Coordinates</th>
                <th className="pb-3 text-sm font-semibold">Time</th>
                <th className="pb-3 text-sm font-semibold">Map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/5">
              {locations.map((location) => (
                <tr key={location.id} className="group hover:bg-white/20 transition-colors">
                  <td className="py-4">
                    <p className="font-medium">{location.name}</p>
                  </td>
                  <td className="py-4">
                    {location.user ? (
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{location.user.name}</p>
                        <p className="text-xs text-gray-500">{location.user.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Anonymous</p>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="text-sm space-y-1">
                      <p className="font-mono">Lat: {location.latitude.toFixed(6)}</p>
                      <p className="font-mono">Lng: {location.longitude.toFixed(6)}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-600">{timeAgo(location.createdAt)}</p>
                  </td>
                  <td className="py-4">
                    <a
                      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      View on Map
                    </a>
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
