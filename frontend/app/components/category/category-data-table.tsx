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
import { ArrowUpDown, Check, ChevronDown, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { getCategories } from "@/app/services/category"
import { DataTablePagination } from "../data-table-pagination"
import { getUser, getUserAndPermissions, getUsers, loggedIn } from "@/app/services/auth"
import { getPermission } from "@/app/services/user-permissions"
import { CategoryAddOrUpdateDialog } from "./category-add-update.dialog"
import { FaFilePdf } from "react-icons/fa6";



export type categoryType = {
    id: string,
    category_name: string,
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
export type currentUserType = {
    first_name: string,
}


export const CategoryDataTable = (props: ResponseDataType) => {

    const columns: ColumnDef<categoryType>[] = [
        {
            accessorKey: "id",
            header: () => <div className="text-right">ID</div>,
            cell: ({ row }) => {
                const id = parseInt(row.getValue("id"))

                return <div className="text-center font-medium">{id}</div>
            },
        },

        {
            accessorKey: "category_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("category_name")}</div>,
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
            cell: ({ row }) => <div className="lowercase">{row.getValue("created_at")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const category = row.original
                return (
                    <div className="flex flex-row items-center gap-1">
                        <CategoryAddOrUpdateDialog data={{
                            id: category.id, category_name: category.category_name, created_at: category.created_at
                        }} />
                        <DeleteCategoryDialog id={category.id} />
                    </div>
                )
            },
        },
    ]

    const response = props.response
    // console.log(response)
    const [newResponse, setNewResponse] = React.useState<categoryType[]>([])
    const [isOpen, setIsOpen] = React.useState(false)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [resourceData, setResourceData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState<currentUserType>()
    const [userData, setUserData] = React.useState()
    const [permissions, setPermissions] = React.useState<permissionType>()
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    // const data: userPermissionType[] = response;
    const data: categoryType[] = newResponse;
    const [role, setRole] = React.useState("user")
    const router = useRouter()
    const [id, setId] = React.useState(1)
    const [roleId, setRoleId] = React.useState()
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

    async function handleclick() {
        router.push("reports/category")
    }

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
                setRoleId(filterUsers.role.id)
                const userId = filterUsers.id
                setId(userId)
                const filterPermission = await getData.permissions
                //  for category resource id =7
                const permissionsDb = filterPermission.filter((p: any) => p.resource == 5)
                setPermissions(permissionsDb)
                // get response data
                const categoryResponse = props.response;
                let arr = []
                for (let i = 0; i < categoryResponse.length; i++) {
                    const element = categoryResponse[i];
                    const newCategoryData: categoryType = {
                        'id': element.id,
                        'category_name': element.category_name,
                        'created_at': element.created_at,
                    }
                    arr.push(newCategoryData)
                }
                if (arr.length > 0) {
                    setNewResponse(arr)
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
                        placeholder="Filter category name..."
                        value={(table.getColumn("category_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("category_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm mr-2"
                    />
                    <div className="w-full flex flex-row gap-1">
                        <CategoryAddOrUpdateDialog data={{
                            id: "0", category_name: undefined,
                            created_at: undefined
                        }} />
                        <div><Button type="button" variant="outline" className="text-blue-900" onClick={handleclick}><FaFilePdf /></Button></div>
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
