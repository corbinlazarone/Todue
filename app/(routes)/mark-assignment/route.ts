import { console } from "inspector";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  console.log("PUT request received");

  return NextResponse.json(
    { message: "PUT request successful" },
    { status: 200 }
  );
}