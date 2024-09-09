"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@ui/components/card';
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Textarea } from "@ui/components/textarea";
import axios from "axios";

const AddQuoteForm = () => {
    const [loading, setLoading] = useState(false);
    const [formEntries, setFormEntries] = useState([
        { id: Date.now(), movie: '', quote: '', year: '', language: 'English' }
    ]);

    const handleChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormEntries(prevEntries =>
            prevEntries.map(entry =>
                entry.id === id ? { ...entry, [name]: value } : entry
            )
        );
    };

    const addFormEntry = () => {
        setFormEntries([...formEntries, { id: Date.now(), movie: '', quote: '', year: '', language: 'English' }]);
    };

    const removeFormEntry = (id: number) => {
        setFormEntries(formEntries.filter(entry => entry.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post('/api/quote/form', formEntries);
            alert('Form submitted! Check the console for data.');
            console.log(formEntries);
        } catch (error) {
            console.log("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Quotes</CardTitle>
                    <CardDescription>Upload a new quote or multiple quotes by clicking on the add button</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 items-center h-4 gap-2 text-center">
                        <Label className="block text-sm font-medium text-gray-700">Movie Name</Label>
                        <Label className="block text-sm font-medium text-gray-700">Quote</Label>
                        <Label className="block text-sm font-medium text-gray-700">Language</Label>
                        <Label className="block text-sm font-medium text-gray-700">Year</Label>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {formEntries.map((entry, index) => (
                            <div key={entry.id} className="grid grid-cols-4 items-center h-16 gap-2">
                                <div>
                                    <Input
                                        type="text"
                                        name="movie"
                                        value={entry.movie}
                                        onChange={(e) => handleChange(entry.id, e)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter movie name"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="quote"
                                        value={entry.quote}
                                        onChange={(e) => handleChange(entry.id, e)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter quote"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="language"
                                        value={entry.language}
                                        onChange={(e) => handleChange(entry.id, e)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter Langauge"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2 justify-center">
                                    <Input
                                        type="text"
                                        name="year"
                                        value={entry.year}
                                        onChange={(e) => handleChange(entry.id, e)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter year of release"
                                    />
                                    <div className="flex items-center">
                                        <Button
                                            type="button"
                                            className="mr-2 px-4 py-2"
                                            onClick={() => removeFormEntry(entry.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex flex-row gap-5">
                            <Button
                                type="button"
                                variant={"outline"}
                                className="px-4 py-2 mb-4 w-full"
                                onClick={addFormEntry}
                            >
                                Add Another Quote
                            </Button>
                            <Button
                                type="submit"
                                className="px-4 py-2 w-full"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddQuoteForm;
