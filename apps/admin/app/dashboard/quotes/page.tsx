"use client";

import PageContainer from "../../../components/Layout";
import { Label } from "@ui/components/label";
import { Quotes } from "../../../libs/data";
import useSWR from "swr";
import { fetcher } from "../../../libs/utils";
import { QuotesTable } from "../../../components/Tables/QuotesTable";
import { columns } from "../../../components/Tables/columns";


type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default function Dashboard({ searchParams }: paramsProps) {

    const page = Number(searchParams.page) || 1;
    const pageLimit = Number(searchParams.limit) || 10;


    const { data, error, isLoading } = useSWR("/api/quote", fetcher);

    if (isLoading) return <div>Loading...</div>

    if (error) return <div>Failed to load</div>

    if (!isLoading && !error && !data) return <div>No data</div>

    const quotes = data;
    const totalQuotes = data?.length;
    const pageCount = Math.ceil(totalQuotes / pageLimit);

    return (
        <PageContainer scrollable={true}>
            <div className="grid grid-cols-1 gap-5">
                <Label className="text-4xl font-bold">All Quotes</Label>
                {!isLoading && data && (
                    <QuotesTable
                        searchKey="quotes"
                        pageNo={page}
                        columns={columns}
                        totalUsers={totalQuotes}
                        data={quotes}
                        pageCount={pageCount}
                    />
                )}
            </div>
        </PageContainer>
    );
}
