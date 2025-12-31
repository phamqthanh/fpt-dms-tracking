"use client";
import prisma from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import RefreshButton from "./refresh-button";
import { createQuery } from "react-query-kit";
import { client } from "@/src/api";
import { Device, Location, User } from "@prisma/client";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
const LIMIT = 10;
interface ResponseData<D> {
  success: boolean;
  status: number;
  data: D;
  error?: string;
}
const useLocations = createQuery({
  queryKey: ["locations"],
  fetcher: async (page: number = 0) => {
    const locations = await client
      .get<ResponseData<(Location & { user: User; device: Device })[]>>("/locations", {
        params: {
          limit: LIMIT,
          offset: page * LIMIT,
        },
      })
      .then((res) => res.data.data);
    return locations;
  },
});

export default function Table() {
  const [page, setPage] = useState(0);
  const queryLocation = useLocations({ variables: page, placeholderData: keepPreviousData });
  const locations = queryLocation.data || [];
  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg container mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">User Locations Tracking</h2>
          <p className="text-sm text-gray-500">Fetched {locations.length} locations</p>
        </div>
        <RefreshButton />
      </div>
      <div className="relative">
        {locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No locations tracked yet</div>
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
                  <th className="pb-3 text-sm font-semibold">Device Name</th>
                  <th className="pb-3 text-sm font-semibold">Brand</th>
                  <th className="pb-3 text-sm font-semibold">Model ID</th>
                  <th className="pb-3 text-sm font-semibold">Model Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/5">
                {locations.map((location) => (
                  <tr key={location.id} className="group hover:bg-white/20 transition-colors">
                    <td className="py-4">
                      <p className="font-medium">{location.user?.name}</p>
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
                    <td className="py-4">
                      <p className="text-sm text-gray-700">
                        {location.device?.deviceName || "N/A"}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-700">{location.device?.brand || "N/A"}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-700">{location.device?.modelId || "N/A"}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-700">{location.device?.modelName || "N/A"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {queryLocation.isFetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page + 1}</span>
        <button
          onClick={nextPage}
          disabled={locations.length < LIMIT}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
