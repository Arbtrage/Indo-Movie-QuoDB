"use client"

import { useState } from "react";
import Papa from 'papaparse';
import { Label } from "@ui/components/label";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";

interface QuoteRequest {
    movie: string;
    quote: string;
    year: string;
    language: string;
}

const Uploader = () => {
    const [movieName, setMovieName] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [language, setLanguage] = useState<string>("");
    const [fileData, setFileData] = useState<any>();
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        console.log("File uploaded")
        if (file) {
            setFileName(file.name);
            setFileSize(file.size);
            const fileType = file.type;
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            if (fileExtension === 'csv' || fileType === 'text/csv') {
                console.log('File is a CSV');
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const text = e.target.result;
                    Papa.parse(text, {
                        header: false,
                        skipEmptyLines: true,
                        complete: (results) => {
                            const data = results.data;
                            const thirdColumnData = data
                                .map((row: any) => row[2] ? row[2].replace(/^'|'$/g, ' ') : undefined)
                                .filter(entry => entry !== undefined); setFileData(thirdColumnData);
                        }
                    });
                };
                reader.readAsText(file);
            } else if (fileExtension === 'srt' || fileType === 'application/x-subrip') {
                console.log('File is an SRT');
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const text = e.target.result;
                    const quotes = parseSRT(text);
                    setFileData(quotes);
                    console.log(quotes);
                };
                reader.readAsText(file);
            } else {
                console.error('Unsupported file type');
            }
        }
    };

    const parseSRT = (srtText: any) => {
        // Split by double newlines to separate blocks
        const srtBlocks = srtText.split(/\r?\n\r?\n/);

        // Process each block to extract quotes
        const quotes = srtBlocks.map((block: any) => {
            // Split each block into lines
            const lines = block.split(/\r?\n/);

            // Extract lines that are dialogue (skip first two lines typically)
            const quoteLines = lines.slice(2);

            // Join the quote lines into a single string and trim excess whitespace
            return quoteLines.join(' ').trim();
        }).filter((quote: any) => quote.length > 0 && !quote.startsWith('(') && !quote.startsWith('[')); // Filter out empty lines or non-dialogue lines

        return quotes;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        if (fileData.length > 0 && movieName && year && language) {
            const payload: QuoteRequest[] = fileData.map((quote: string) => ({
                id: 1,
                movie: movieName,
                quote,
                year,
                language,
            }));

            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const r=await response.json()
            console.log(r)
            if (response.ok) {
                alert('Uploaded successfully');
                console.log('Data sent successfully');
            } else {
                alert('Failed to send data');
                console.error('Failed to send data');
            }
        } else {
            console.error('Missing required fields or file data');
        }
        setFileData([]);
        setMovieName('');
        setYear('');
        setLanguage('');
        setFileName('');
        setFileSize(0);
        setLoading(false);
    };


    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
            <div className="mb-4">
                <Label htmlFor="movieName">Movie Name</Label>
                <Input
                    id="movieName"
                    type="text"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    className="mt-2 w-full p-2 border rounded-md"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="year">Year</Label>
                <Input
                    id="year"
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-2 w-full p-2 border rounded-md"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="language">Language</Label>
                <Input
                    id="language"
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-2 w-full p-2 border rounded-md"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="file">Upload File</Label>
                <div className="flex items-center justify-center w-full">
                    <Label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">CSV or SRT (MAX. 4MB)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                    </Label>
                </div>
            </div>

            {fileName && (
                <div className="mb-4">
                    <p className="text-sm text-gray-700">File: {fileName}</p>
                    <p className="text-sm text-gray-700">Size: {(fileSize / 1024).toFixed(2)} KB</p>
                </div>
            )}

            <Button type="submit" className="w-full text-white py-2 px-4 rounded-md " disabled={!movieName || !year || !language || !File || loading}>
                Submit
            </Button>
        </form>
    )
}

export default Uploader;
