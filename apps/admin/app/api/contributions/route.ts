import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../libs/prisma";

export const GET = async (req: NextRequest) => {
    const contributions = await prisma.contributions.findMany();
    return new NextResponse(JSON.stringify(contributions), { status: 200 })
}