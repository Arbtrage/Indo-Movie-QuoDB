import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../libs/prisma";
import { Status, Language } from "@prisma/client";
import { getSession } from "../../../libs/auth";
import axios from "axios";
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const QUOTE_API_URL = process.env.QUOTE_API_URL || "http:///13.233.190.198/v1/quote/add-quotes-bulk";
interface QuoteRequest {
    movie: string;
    quote: string;
    year: string;
    language: Language;
}
const BATCH_SIZE = 50;

export const POST = async (req: NextRequest) => {
    const session = await getSession();
    const data = await req.json() as QuoteRequest[];
    if (data.length === 0) {
        return new NextResponse(JSON.stringify({ success: false, error: "Missing required fields" }), { status: 400 });
    }

    const batches = Math.ceil(data.length / BATCH_SIZE);

    try {
        for (let i = 0; i < batches; i++) {
            const batchData = data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            let quoteData: any = [];

            console.log("Batch", i + 1, "of", batches, "started");

            await prisma.$transaction(async (tx) => {
                for (const quote of batchData) {
                    const createdQuote = await tx.quotes.create({
                        data: {
                            movie: quote.movie,
                            quote: quote.quote,
                            year: quote.year,
                            language: quote.language,
                            status: Status.APPROVED,
                            userId: session?.user?.id,
                        },
                    });
                    quoteData.push({
                        quote_id: createdQuote.id,
                        quote: createdQuote.quote,
                    });
                }
            });

            if (quoteData.length > 0) {
                const apiResponse = await axios.post(QUOTE_API_URL, quoteData);
                if (apiResponse.status !== 200) {
                    console.error(`Failed to post batch ${i} to API: ${apiResponse.status}`);
                    throw new Error(`API responded with status: ${apiResponse.status}`);
                }
            }

            console.log("Batch", i + 1, "posted successfully");
        }
        return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error("Error in POST transaction", error);
        return new NextResponse(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    const quotes = await prisma.quotes.findMany();
    return new NextResponse(JSON.stringify(quotes), { status: 200 })
}