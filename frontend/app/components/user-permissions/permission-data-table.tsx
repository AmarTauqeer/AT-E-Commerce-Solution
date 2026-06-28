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
import { getUserAndPermissions, getUsers, loggedIn } from "@/app/services/auth"
import { getResources } from "@/app/services/resource"
import { DataTablePagination } from "../data-table-pagination"
import { PermissionsAddOrUpdateDialog } from "./permission-add-update-dialog"
import { DeletePermissionDialog } from "./delete-permission-dialog"



export type userPermissionType = {
    id: string,
    first_name: string,
    resource_name: string,
    user: string,
    resource: string,
    Read: boolean,
    Write: boolean,
    Update: boolean,
    Delete: boolean,
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


export const PermissionsDataTable = (props: ResponseDataType) => {

    const columns: ColumnDef<userPermissionType>[] = [
        {
            accessorKey: "id",
            header: () => <div className="text-right font-bold">ID</div>,
            cell: ({ row }) => {
                const id = parseInt(row.getValue("id"))

                return <div className="text-center font-medium">{id}</div>
            },
        },
        {
            accessorKey: "first_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        User
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("first_name")}</div>,
        },
        {
            accessorKey: "resource_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Resource
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("resource_name")}</div>,
        },

        {
            accessorKey: "Write",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
                    >
                        Write
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">
                {
                    row.getValue("Write") == false ? <><Button className="h-5 w-5" variant="destructive" size="icon">
                        <X />
                    </Button>
                    </> :
                        <Button className=" bg-green-600 text-white hover:bg-green-700 h-5 w-5" variant="ghost" size="icon">
                            <Check />
                        </Button>
                }
            </div>,
        },
        {
            accessorKey: "Read",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
                    >
                        Read
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{
                row.getValue("Read") == false ? <><Button variant="destructive" className="h-5 w-5" size="icon">
                    <X />
                </Button>
                </> :
                    <Button className=" bg-green-600 text-white hover:bg-green-700 h-5 w-5" variant="ghost" size="icon">
                        <Check />
                    </Button>
            }</div>,
        },
        {
            accessorKey: "Update",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
                    >
                        Update
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{
                row.getValue("Update") == false ? <><Button className="h-5 w-5" variant="destructive" size="icon">
                    <X />
                </Button>
                </> :
                    <Button className=" bg-green-600 text-white hover:bg-green-700 h-5 w-5" variant="ghost" size="icon">
                        <Check />
                    </Button>
            }</div>,
        },
        {
            accessorKey: "Delete",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
                    >
                        Delete
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{
                row.getValue("Delete") == false ? <><Button className="h-5 w-5" variant="destructive" size="icon">
                    <X />
                </Button>
                </> :
                    <Button className=" bg-green-600 text-white hover:bg-green-700 h-5 w-5" variant="ghost" size="icon">
                        <Check />
                    </Button>
            }</div>,
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold"
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
                const permission = row.original

                return (
                    <div className="flex flex-row items-center gap-1">
                        <PermissionsAddOrUpdateDialog data={{
                            id: permission.id, resource: permission.resource,
                            user: permission.user, Read: permission.Read, Write: permission.Write,
                            Delete: permission.Delete, Update: permission.Update, created_at: permission.created_at
                        }} />
                        <DeletePermissionDialog id={permission.id} />
                    </div>
                )
            },
        },
    ]

    const response = props.response
    const [newResponse, setNewResponse] = React.useState([])
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
    const data: userPermissionType[] = newResponse;
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
                //  for profile resource id =5
                const permissionsDb = filterPermission.filter((p: any) => p.resource == 5)
                setPermissions(permissionsDb)

                if (role_name == 'user') {
                    toast.error(<span className="text-red-500">You don't have permission to access this page!</span>)
                    router.replace("/admin-login");
                }
                const resourceData = await getResources()
                // setResourceData(await respJson)

                const usersResponseJson = await getUsers();
                setUserData(usersResponseJson)

                // get response data
                const permissionResponse = props.response;
                let arr:any = []
                for (let i = 0; i < permissionResponse.length; i++) {
                    const element = permissionResponse[i];
                    // get resource name
                    const filterResourceData = resourceData.filter((i: any) => i.id == element.resource)
                    const resource_name = filterResourceData[0].resource_name;
                    const filterUserData = usersResponseJson.filter((u: any) => u.id == element.user)
                    const first_name = filterUserData[0].first_name

                    const newPermissionData: userPermissionType = {
                        'id': element.id,
                        'first_name': first_name,
                        'resource_name': resource_name,
                        'user': element.user,
                        'resource': element.resource,
                        'Write': element.Write,
                        'Read': element.Read,
                        'Update': element.Update,
                        'Delete': element.Delete,
                        'created_at': element.created_at,
                    }
                    arr.push(newPermissionData)
                }
                setNewResponse(arr)
            }
        }
        getUserRole()

    }, [props])


    return (
        <>
            {role && role == 'user' ? "" : <div className="w-full">
                <div className="flex flex-col items-center py-4 md:flex-row">
                    <Input
                        placeholder="Filter resource..."
                        value={(table.getColumn("resource_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("resource_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm mr-2"
                    />
                    <div className="w-full">
                        <PermissionsAddOrUpdateDialog data={{
                            id: "0", resource: undefined, user: response.length > 0 ? response[0].user : undefined,
                            Read: undefined, Write: undefined, Update: undefined, Delete: undefined, created_at: undefined
                        }} />

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
