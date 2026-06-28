"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { DataTablePagination } from "../data-table-pagination"
import { DeleteOrderDialog } from "./order-delete-dialog"
import { OrderAddOrUpdateDialog } from "./order-add-update-dialog"
import { getUserAndPermissions, loggedIn } from "@/app/services/auth"
import { FaFilePdf } from "react-icons/fa6"



export type orderType = {
    id: string,
    user_id: string,
    email: string,
    order_amount: number,
    order_status: string
    created_at: Date,
};

export type ResponseDataType = {
    response: any
}

export type permissionType = {
    resource: number,
    Read: boolean,
    Write: boolean,
    Update: boolean,
    Delete: boolean
}




export const CustomerOrderDataTable = (props: ResponseDataType) => {

        async function handleclick(id:number){
            router.push(`reports/order?id=${id}`)
    }


    const columns: ColumnDef<orderType>[] = [
        {
            accessorKey: "id",
            header: () => <div className="text-right">ID</div>,
            cell: ({ row }) => {
                const id = parseInt(row.getValue("id"))

                return <div className="text-center font-medium">{id}</div>
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        User
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "order_status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) =>  <div className={row.getValue("order_status") == 'Created' && row.getValue("order_status")!='Delivered'?
                        "w-30 flex items-center justify-center text-sm font-semibold text-white py-1 rounded-lg bg-yellow-500" :row.getValue("order_status")=='Pending'?
                        "w-30 flex items-center justify-center text-sm font-semibold text-white py-1 rounded-lg bg-orange-500":
                        "w-30 flex items-center justify-center text-sm font-semibold text-white py-1 rounded-lg bg-green-600"}>
                        {row.getValue("order_status")}</div>,
        },
        {
            accessorKey: "order_amount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Amount
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase text-end font-semibold">{parseInt(row.getValue("order_amount")).toFixed(2)}</div>,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Date
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{new Date(row.getValue("created_at")).toISOString().split('T')[0]}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original

                return (
                    <div className="flex items-center gap-1">
                        {permissions !== undefined ? permissions.Update && permissions.resource == 6 ?
                            <OrderAddOrUpdateDialog data={{
                                id: order.id, user_id: order.user_id,
                                email: order.email,
                                order_status: order.order_status, order_amount: order.order_amount
                                , created_at: order.created_at, users: users, products: products, orderItems: orderItems
                            }} />
                            : "" : ""}

                        {permissions !== undefined ? permissions.Delete && permissions.resource == 6 ?
                            <DeleteOrderDialog id={order.id} />
                            : "" : ""}
                             <Button type="button" size="icon" variant="outline" className="text-blue-900" onClick={(e)=>handleclick(parseInt(order.id))}><FaFilePdf /></Button>

                    </div>
                )
            },
        },
    ]
    const response = props.response.response
    const users = props.response.users
    const products = props.response.products
    const orderItems = props.response.orderItems
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [permissions, setPermissions] = React.useState<permissionType>()
    const [role, setRole] = React.useState("user")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const data: orderType[] = response;
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 5
            }
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    React.useEffect(() => {
        const getLoginStatus = async () => {
            const loginStatus = await loggedIn();
            if (loginStatus == "loggedout") {
                redirect("/admin-login");
            }
        }
        getLoginStatus()

        const getUserRole = async () => {
            const getData = await getUserAndPermissions()

            const filterUsers = await getData.user
            if (filterUsers.email) {
                let role_name = filterUsers.role.role_name
                setRole(role_name)
                const filterPermission = await getData.permissions
                //  for order resource id =6
                const permissionsDb = filterPermission.filter((p: any) => p.resource == 6)
                setPermissions(permissionsDb[0])

                if (role_name == 'user') {
                    toast.error(<span className="text-red-500">You don't have permission to access this page!</span>)
                    router.replace("/login");
                }
            }
        }
        getUserRole()
    }, [props])


    return (
        <>
            {role && role == 'user' ? "" : <div className="w-full">
                <div className="flex flex-col items-center py-4 md:flex-row">
                    <Input
                        placeholder="Filter user/email..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm mr-2"
                    />
                   
                    <div className="w-full">
                        
                        {permissions !== undefined && permissions.Write && permissions.resource == 6 &&
                            <OrderAddOrUpdateDialog data={{
                                id: "0", user_id: undefined, email: undefined,
                                order_status: undefined, order_amount: undefined, users: users, products: products, orderItems: orderItems
                            }} />
                            }

                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>}>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <br></br>
                <DataTablePagination table={table} />
            </div>}


        </>
    )
}
