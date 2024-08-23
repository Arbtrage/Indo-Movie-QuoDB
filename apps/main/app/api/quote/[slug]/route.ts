import { NextResponse, NextRequest } from "next/server";
export const dynamic = 'force-dynamic'
import axios from "axios";


export const GET = async (
    request: NextRequest,
    { params }: { params: { slug: string } }
) => {
    const response = await axios.get(process.env.NEXT_SERVER_URL || "http://localhost:8000/v1/quote/search?query=" + params.slug);
    const quotesData = response.data;

    const data = quotesData.map((quote: any) => {
        return {
            id: quote._id,
            movie: quote._source.Movie,
            year: quote._source.Year,
            quote: quote._source.Quote,
        };
    });
    return NextResponse.json(data);
};