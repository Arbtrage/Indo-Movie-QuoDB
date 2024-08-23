import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic'

export const POST = async (
    request: NextRequest
) => {
    try {
        const req = await request.json();
        const response = await axios.post(process.env.NEXT_TRANSLATE_URL || 'http://13.233.190.198/v1/translate/translate-spec', req.data);
        return NextResponse.json({ status: 200, data: response.data });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return NextResponse.json({ status: 500, error: "Internal Server Error" });
    }
};
