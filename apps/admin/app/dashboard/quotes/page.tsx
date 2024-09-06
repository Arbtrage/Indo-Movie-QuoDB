"use client";
import React, { useState, useEffect } from "react";
import PageContainer from "../../../components/Layout";
import { Label } from "@ui/components/label";
import useSWR from "swr";
import { fetcher } from "../../../libs/utils";
import { QuotesTable } from "../../../components/Tables/QuotesTable";
import { columns } from "../../../components/Tables/columns";

export default function Dashboard() {
    const { data, error, isLoading } = useSWR('/api/quote', fetcher);

    // State to manage client-side pagination
    const [page, setPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);

    // Prepare data for current page
    const startIndex = (page - 1) * pageLimit;
    const currentData = data ? data.quotes.slice(startIndex, startIndex + pageLimit) : [];
    const totalQuotes = data ? data.totalQuotes : 0;
    const pageCount = Math.ceil(totalQuotes / pageLimit);

    // Handlers for page changes
    const handlePageChange = (newPage: any) => {
        setPage(newPage);
    };

    const handlePageLimitChange = (newLimit: any) => {
        setPageLimit(newLimit);
        setPage(1); // Reset to first page to avoid out-of-bound error when reducing page limit
    };

    return (
        <PageContainer scrollable={true}>
            <div className="grid grid-cols-1 gap-5">
                <Label className="text-4xl font-bold">All Quotes</Label>
                {!isLoading && data ? (
                    <QuotesTable
                        searchKey="quotes"
                        pageNo={page}
                        columns={columns}
                        totalUsers={totalQuotes}
                        data={currentData}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        onPageLimitChange={handlePageLimitChange}
                    />
                ) : <>Loading...</>}
            </div>
        </PageContainer>
    );
}
