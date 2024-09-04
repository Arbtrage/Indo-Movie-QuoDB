'use client';
import { Checkbox } from '@ui/components/checkbox';
import { Quotes } from '../../libs/data';
import { ColumnDef } from '@tanstack/react-table';


export const columns: ColumnDef<Quotes>[] = [
    {
        accessorKey: 'movie',
        header: 'Movie'
    },
    {
        accessorKey: 'quote',
        header: 'Quote'
    },
    {
        accessorKey: 'year',
        header: 'Year'
    },
    {
        accessorKey: 'language',
        header: 'Language'
    },
];