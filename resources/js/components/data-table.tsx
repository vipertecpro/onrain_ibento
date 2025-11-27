'use client';

import { useState, useEffect, useRef } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    RowSelectionState,
} from '@tanstack/react-table';
import { ArrowUpDown, Filter, Download, Upload, Bolt, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: { label: string; value: string }[];
}

interface DataTableProps<T extends { id: number }> {
    data: T[];
    columns: ColumnDef<T>[];
    searchKey?: string;
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    onPageChange: (page: number) => void;
    filterConfig?: FilterField[];
    onApplyFilters?: (filters: Record<string, string>) => void;
    activeFilters?: Record<string, string>;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onBulkDelete?: (items: T[]) => void;
    routes?: Partial<{
        import: string;
        export: string;
        exportSample: string;
    }>;
}

export function DataTable<T extends { id: number }>({
                                                        data,
                                                        columns,
                                                        searchKey = 'name',
                                                        pagination,
                                                        onPageChange,
                                                        filterConfig = [],
                                                        onApplyFilters,
                                                        activeFilters = {},
                                                        onEdit,
                                                        onDelete,
                                                        onBulkDelete,
                                                        routes,
                                                    }: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [searchInput, setSearchInput] = useState(activeFilters.search || '');
    const [filterOpen, setFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState<Record<string, string>>({});
    const [isImportOpen, setIsImportOpen] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTempFilters(activeFilters);
    }, [activeFilters]);

    useEffect(() => {
        setSearchInput(activeFilters.search || '');
    }, [activeFilters.search]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(pagination.total / pagination.per_page),
        state: {
            sorting,
            rowSelection,
        },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
    });

    const selectedCount = Object.keys(rowSelection).length;

    const handleImport = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!routes?.import) {
            console.warn('Import route not available');
            setIsImportOpen(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        router.post(routes.import, formData, {
            forceFormData: true,
            onSuccess: () => setIsImportOpen(false),
        });
    };
    return (
        <div className="flex h-full flex-col p-2">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={`Search ${searchKey}...`}
                        value={searchInput}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchInput(val);

                            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

                            searchTimeoutRef.current = setTimeout(() => {
                                onApplyFilters?.({ ...tempFilters, search: val });
                            }, 500);
                        }}
                        className="max-w-sm"
                    />
                    {filterConfig.length > 0 && (
                        <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => setFilterOpen(true)}>
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                            {Object.keys(activeFilters).filter(k => k !== 'search' && k !== 'page').length > 0 && (
                                <span className="ml-1 text-xs">({Object.keys(activeFilters).filter(k => k !== 'search' && k !== 'page').length})</span>
                            )}
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {selectedCount > 0 && onBulkDelete && (
                        <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => {
                                const selected = table.getSelectedRowModel().rows.map(r => r.original);
                                onBulkDelete(selected);
                                setRowSelection({});
                            }}
                        >
                            Delete {selectedCount}
                        </Button>
                    )}
                    {(routes?.import || routes?.export || routes?.exportSample) && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="cursor-pointer">
                                        <Bolt /> Module Actions
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    {/* Sample Excel */}
                                    {routes?.exportSample && (
                                        <DropdownMenuItem asChild>
                                            <a href={routes.exportSample} className="flex items-center">
                                                <Download className="mr-2 h-4 w-4" /> Sample Excel
                                            </a>
                                        </DropdownMenuItem>
                                    )}

                                    {/* Export Filtered */}
                                    {routes?.export ? (
                                        <DropdownMenuItem asChild>
                                            <a
                                                href={`${routes.export}?${new URLSearchParams(activeFilters).toString()}`}
                                                className="flex items-center"
                                            >
                                                <Download className="mr-2 h-4 w-4" /> Export Filtered
                                            </a>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem className="flex items-center opacity-50 pointer-events-none">
                                            <Download className="mr-2 h-4 w-4" /> Export Filtered
                                        </DropdownMenuItem>
                                    )}

                                    {/* Import Trigger (no Dialog inside menu!) */}
                                    {routes?.import ? (
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setIsImportOpen(true);
                                            }}
                                            className="flex items-center"
                                        >
                                            <Upload className="mr-2 h-4 w-4" /> Import
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem className="flex items-center opacity-50 pointer-events-none">
                                            <Upload className="mr-2 h-4 w-4" /> Import
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {routes?.import && (
                                <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Import Data</DialogTitle>
                                        </DialogHeader>

                                        <form onSubmit={handleImport}>
                                            <div className="space-y-4 py-4">
                                                <Label>Excel/CSV File</Label>
                                                <Input type="file" name="file" accept=".xlsx,.xls,.csv" required />
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit" size="sm" className="cursor-pointer">
                                                    Upload
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto border rounded-t-md">
                <table className={'w-full text-sm'}>
                    <thead className="sticky top-0 bg-background z-20 shadow-sm">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {onBulkDelete &&
                                    (
                                        <TableHead className="w-10">
                                            <Checkbox
                                                checked={table.getIsAllRowsSelected()}
                                                onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                    )
                                }
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="h-10 px-2 text-left">
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-1' : ''}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && <ArrowUpDown className="h-4 w-4" />}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableHead className="h-10 px-2 text-left">Actions</TableHead>
                                )}
                            </TableRow>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {onBulkDelete &&
                                        (
                                            <TableCell className="w-12">
                                                <Checkbox
                                                    checked={row.getIsSelected()}
                                                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                        )
                                    }
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="p-1">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <TableCell className="p-1">
                                            <div className="flex gap-2">
                                                {onEdit && (
                                                    <Button
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => onEdit(row.original)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="cursor-pointer"
                                                        onClick={() => onDelete(row.original)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} className="h-[calc(100vh-18.5rem)] text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="sticky bottom-0 z-20 border-t bg-background/95 backdrop-blur pt-2">
                <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Total: <strong>{pagination.total}</strong> | Showing{' '}
                        {(pagination.current_page - 1) * pagination.per_page + 1}–{' '}
                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onPageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm">
                          Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onPageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Filters</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {filterConfig.map(field => (
                            <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">{field.label}</Label>
                                <div className="col-span-3 relative">
                                    {field.type === 'date' && (
                                        <Input
                                            type="date"
                                            value={tempFilters[field.key] || ''}
                                            onChange={(e) => setTempFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                        />
                                    )}
                                    {field.type === 'text' && (
                                        <Input
                                            type="text"
                                            value={tempFilters[field.key] || ''}
                                            onChange={(e) =>
                                                setTempFilters(prev => ({ ...prev, [field.key]: e.target.value }))
                                            }
                                        />
                                    )}
                                    {field.type === "select" && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    className={cn(
                                                        "flex w-full justify-between rounded-md border px-3 py-2 text-sm text-left",
                                                        "focus:outline-none focus:ring-2 focus:ring-ring",
                                                        !tempFilters[field.key] && "text-muted-foreground"
                                                    )}
                                                >
                                                    {tempFilters[field.key]
                                                        ? field.options?.find((o) => o.value === tempFilters[field.key])?.label
                                                        : `Select ${field.label}`}

                                                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                                                <Command>
                                                    <CommandInput placeholder={`Search ${field.label}...`} />
                                                    <CommandEmpty>No results.</CommandEmpty>

                                                    <CommandGroup>
                                                        {field.options?.map((opt) => (
                                                            <CommandItem
                                                                key={opt.value}
                                                                onSelect={() => {
                                                                    setTempFilters(prev => ({
                                                                        ...prev,
                                                                        [field.key]: opt.value,
                                                                    }));
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        tempFilters[field.key] === opt.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {opt.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => {
                                setTempFilters({});
                                onApplyFilters?.({});
                                setFilterOpen(false);
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => {
                                onApplyFilters?.(tempFilters);
                                setFilterOpen(false);
                            }}
                        >
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
