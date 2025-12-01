import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Lấy danh sách tất cả users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        locations: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { locations: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
