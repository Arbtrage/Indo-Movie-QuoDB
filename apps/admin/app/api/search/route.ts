import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import prisma from "../../../libs/prisma";

export const dynamic = 'force-dynamic'

export const POST = async (
    request: NextRequest
) => {
    try {
        const req = await request.json();
        const response = await axios.get(process.env.NEXT_SERVER_QUOTE_SEARCH + req.quote);
        const quotesData = response.data;
        console.log(quotesData)

        const quotesfinal = await Promise.all(
            quotesData.map(async (quote: any) => {
                const data = await prisma.quotes.findFirst({
                    where: {
                        id: quote._source.ID
                    },
                    select: {
                        id: true,
                        movie: true,
                        year: true,
                        quote: true,
                        language: true
                    }
                });

                if (data) {
                    return data;
                }
                return null;
            })
        );
        const filteredQuotes = quotesfinal.filter(quote => quote !== null);
        return NextResponse.json({ status: 200, data: filteredQuotes });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return NextResponse.json({ status: 500, error: "Internal Server Error" });
    }
};
