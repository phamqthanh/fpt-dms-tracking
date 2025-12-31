import { NextRequest, NextResponse } from "next/server";
interface ResponseOutput {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
type Output = ResponseOutput | NextResponse | string;
export function createEndpoint<Q = {}, D = unknown>(
  func: (
    request: NextRequest,
    response: NextResponse,
    other: {
      query: Q;
      body: D;
    }
  ) => Output | Promise<Output>,
  withAuth = true
) {
  return async function (request: NextRequest, response: NextResponse) {
    try {
      if (withAuth && !request.headers.get("Authorization"))
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      const res = await func(request, response, {
        query: Object.fromEntries(request.nextUrl.searchParams.entries()) as Q,
        body: (await request.json().catch(() => null)) as D,
      });
      if (res instanceof NextResponse) return res;
      else if (typeof res === "object")
        return NextResponse.json(res, {
          status: "status" in res && typeof res.status === "number" ? res.status : 200,
        });
      else if (typeof res === "string") return NextResponse.json({ success: true, message: res });
      else
        return NextResponse.json(
          { success: false, error: "Invalid response from endpoint" },
          { status: 500 }
        );
    } catch (error) {
      console.error("Error in endpoint:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          detail: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  };
}
