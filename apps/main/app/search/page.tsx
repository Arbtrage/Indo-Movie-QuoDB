import React from "react";
import Header from "../../components/Header";
import QuoteCard from "../../components/QuoteCard";
import { Suspense } from 'react'


const page = () => {
    return (
        <div className="relative flex w-full items-center min-h-screen flex-col pt-[80px] overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <Suspense>
                <Header />
                <QuoteCard />
            </Suspense>
        </div>
    );
};

export default page;
