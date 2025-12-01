import Link from 'next/link'
import { Suspense } from 'react'
import Table from '@/components/table'
import TablePlaceholder from '@/components/table-placeholder'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="pt-4 pb-2 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
            User Location Tracking
          </h1>
          <p className="text-gray-600 text-lg">
            Track and monitor user locations in real-time
          </p>
        </div>

        <Suspense fallback={<TablePlaceholder />}>
          <Table />
        </Suspense>

        <div className="flex justify-center gap-4 mb-6">
          <Link
            href="/users"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            View Users →
          </Link>
        </div>

        <div className="bg-white/30 p-6 rounded-lg shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg">
          <h3 className="text-lg font-semibold mb-3">API Endpoints</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-mono text-xs">GET</span>
              <div className="flex-1">
                <code className="text-gray-700">/api/locations</code>
                <p className="text-gray-500 mt-1">Lấy danh sách tất cả locations</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-mono text-xs">POST</span>
              <div className="flex-1">
                <code className="text-gray-700">/api/locations</code>
                <p className="text-gray-500 mt-1">Tạo location tracking mới</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View example payload</summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
{`{
  "name": "Tên địa điểm",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "userEmail": "user@example.com",
  "userName": "Tên User (optional)"
}`}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
