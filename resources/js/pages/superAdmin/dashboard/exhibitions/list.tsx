import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem, Exhibition, ExhibitionsListProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import bankai from '@/routes/bankai';
import SaAppLayout from '@/layouts/superAdmin/sa-app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: bankai.dashboard().url },
    { title: 'Exhibitions', href: bankai.exhibitions.list().url },
];
const columns: ColumnDef<Exhibition>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
        accessorKey: "subdomain",
        header: "Subdomain",
        cell: ({ row }) => {
            const appDomain = import.meta.env.VITE_APP_DOMAIN;
            const protocol = typeof window !== "undefined"
                ? window.location.protocol.replace(":", "")
                : "https";
            const fullUrl = `${protocol}://${row.original.subdomain}.${appDomain}`;
            return (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td className={'w-40'}>For Visitors</td>
                                <td><a href={fullUrl} target={'_blank'} className="text-blue-600 underline break-all cursor-pointer">{fullUrl}</a></td>
                            </tr>
                            <tr>
                                <td>For Admin/Exhibitor</td>
                                <td><a href={fullUrl + '/dashboardPanel'} target={'_blank'} className="text-blue-600 underline break-all cursor-pointer">{fullUrl}/dashboardPanel</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <span className={row.original.status === 'active' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {row.original.status === 'active' ? 'Active' : 'Inactive'}
      </span>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => format(new Date(row.original.created_at), 'dd MMM yyyy, hh:mm a'),
    },
];

const filterConfig = [
    { key: 'from_date', label: 'From Date', type: 'date' as const },
    { key: 'to_date', label: 'To Date', type: 'date' as const },
    {
        key: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
        ],
    },
];

export default function UsersList({ tableData, tableFilters: appliedFilters }: ExhibitionsListProps) {
    const [data, setData] = useState<Exhibition[]>(tableData.data);
    useEffect(() => {
        setData(tableData.data);
    }, [tableData]);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        single?: Exhibition;
        bulk?: Exhibition[];
    }>({ open: false });

    const handlePageChange = (page: number) => {
        router.get(bankai.exhibitions.list().url, { page, ...appliedFilters });
    };
    const handleApplyFilters = (filters: Record<string, string>) => {
        router.get(bankai.exhibitions.list().url, { page: 1,...filters }, {
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    };
    const handleEdit = (exhibition: Exhibition) => {
        router.visit(bankai.exhibitions.edit(exhibition.id).url);
    };
    const handleDelete = (exhibition: Exhibition) => {
        setDeleteDialog({ open: true, single: exhibition });
    };
    const handleBulkDelete = (selected: Exhibition[]) => {
        if (selected.length > 0) {
            setDeleteDialog({ open: true, bulk: selected });
        }
    };

    return (
        <SaAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exhibitions" />
            <Card className="m-2 shadow-none rounded-sm p-0 gap-2 divide-y">
                <CardHeader className="flex flex-row items-center justify-between p-2">
                    <div>
                        <CardTitle className="text-md font-bold">Exhibitions</CardTitle>
                        <CardDescription className={'text-xs'}>All registered exhibitions in the system.</CardDescription>
                    </div>
                    <Link href={bankai.exhibitions.create().url}>
                        <Button size="sm" variant="outline" className={'cursor-pointer'}>
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col h-[calc(100vh-9.3rem)]">
                        <div className="flex-1 overflow-y-auto">
                            <DataTable
                                data={data}
                                columns={columns}
                                searchKey="name"
                                pagination={{
                                    current_page: tableData.current_page,
                                    last_page: tableData.last_page,
                                    total: tableData.total,
                                    per_page: tableData.per_page,
                                }}
                                onPageChange={handlePageChange}
                                filterConfig={filterConfig}
                                onApplyFilters={handleApplyFilters}
                                activeFilters={appliedFilters}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onBulkDelete={handleBulkDelete}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {deleteDialog.bulk ? `Delete ${deleteDialog.bulk.length} exhibitions?` : 'Delete this exhibition?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={'cursor-pointer'}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteDialog.single) {
                                    router.delete(bankai.exhibitions.remove(deleteDialog.single.id).url, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            router.reload({ only: ['tableData'] });
                                            setDeleteDialog({ open: false });
                                        },
                                    });
                                } else if (deleteDialog.bulk) {
                                    router.delete(bankai.exhibitions.removeAll().url, {
                                        data: { ids: deleteDialog.bulk.map(u => u.id) },
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            router.reload({ only: ['tableData'] });
                                            setDeleteDialog({ open: false });
                                        },
                                    });
                                }
                            }}
                            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SaAppLayout>
    );
}
