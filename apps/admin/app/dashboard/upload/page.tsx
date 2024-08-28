"use client";

import React, { useState } from "react";
import AddQuoteForm from "../../../components/Forms/addQuoteForm";
import PageContainer from "../../../components/Layout";
import { Label } from "@ui/components/label";
import { Button } from "@ui/components/button";
import Uploader from "../../../components/Upload";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@ui/components/dialog"

export default function Dashboard() {

    return (
        <PageContainer scrollable={true}>
            <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-row justify-between">
                    <Label className="text-4xl font-bold">Upload Quotes</Label>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Upload CSV/SRT File</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Quotes</DialogTitle>
                                <DialogDescription>
                                    Upload a CSV or an SRT file
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <Uploader />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div>
                    <AddQuoteForm />
                </div>
            </div>
        </PageContainer>
    );
}
