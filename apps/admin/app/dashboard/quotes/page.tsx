"use client";
import React from "react";
import PageContainer from "../../../components/Layout";
import { Label } from "@ui/components/label";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "../../../libs/utils";
import { QuotesTable } from "../../../components/Tables/QuotesTable";
import { columns } from "../../../components/Tables/columns";


type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default function Dashboard({ searchParams }: paramsProps) {
    const router = useRouter();
    const [page, setPage] = React.useState(Number(searchParams.page) || 1);
    const [pageLimit, setPageLimit] = React.useState(Number(searchParams.limit) || 10);
    
    const { data, error, isLoading } = useSWR(`/api/quote?page=${page}&limit=${pageLimit}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        revalidateOnReconnect: true
    });

    React.useEffect(() => {
        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        queryParams.set('limit', pageLimit.toString());

        router.replace(`/dashboard/quotes?${queryParams.toString()}`, { scroll: false });
    }, [page, pageLimit]);


    if (isLoading) return <div>Loading...</div>

    if (error) return <div>Failed to load</div>

    if (!isLoading && !error && !data) return <div>No data</div>

    const quotes = data.quotes;
    const totalQuotes = data.totalQuotes;
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
                        onPageChange={(newPage: number) => setPage(newPage)}
                        onPageLimitChange={(newLimit: number) => setPageLimit(newLimit)}
                    />
                )}
            </div>
        </PageContainer>
    );
}
