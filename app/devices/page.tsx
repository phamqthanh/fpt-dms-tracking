import Link from "next/link";
import { Suspense } from "react";
import TablePlaceholder from "@/components/table-placeholder";
import DeviceTable from "@/components/device-table";

export const dynamic = "force-dynamic";

export default function DevicesPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full container space-y-8">
        <div className="text-center space-y-4">
          <h1 className="pt-4 pb-2 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
            Devices List
          </h1>
          <p className="text-gray-600 text-lg">
            Danh sách thiết bị và số lượng locations đã tracking
          </p>
        </div>

        <Suspense fallback={<TablePlaceholder />}>
          <DeviceTable />
        </Suspense>

        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Back to Locations
          </Link>
        </div>
      </div>
    </main>
  );
}
