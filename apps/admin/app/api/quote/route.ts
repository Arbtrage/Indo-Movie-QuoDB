import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../libs/prisma";
import { Status, Language } from "@prisma/client";
import { getSession } from "../../../libs/auth";
import axios from "axios";

const QUOTE_API_URL = process.env.QUOTE_API_URL || "http://localhost:8000/v1/quote/add-quotes-bulk";

interface QuoteRequest {
    movie: string;
    quote: string;
    year: string;
    language: Language;
}

export const POST = async (req: NextRequest) => {
    try {
        const session = await getSession();
        const data = await req.json() as QuoteRequest[];
        console.log(data)

        if (data.length === 0) {
            return new NextResponse(JSON.stringify({ success: false, error: "Missing required fields" }), {
                status: 400,
            });
        }

        await prisma.$transaction(async (tx) => {
            for (const quote of data) {
                await tx.quotes.create({
                    data: {
                        movie: quote.movie,
                        quote: quote.quote,
                        year: quote.year,
                        language: quote.language,
                        status: Status.APPROVED,
                        userId: session?.user?.id,
                    },
                });
            }
        });

        await axios.post(QUOTE_API_URL, data);
        return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
    } catch (error: any) {
        console.error("Failed to post quote", error.message);

        return new NextResponse(JSON.stringify({ success: false, error: "Internal Server Error" }), {
            status: 500,
        });
    }
};


export const GET = async (req: NextRequest) => {
    const quotes = await prisma.quotes.findMany();
    return new NextResponse(JSON.stringify(quotes), { status: 200 })
}