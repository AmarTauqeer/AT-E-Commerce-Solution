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
export const defaultImage = "default_img.png"

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
import { DeleteProductDialog } from "./delete-product-dialog"
import { getCategories } from "@/app/services/category"
import { DataTablePagination } from "../data-table-pagination"
import { ProductAddOrUpdateDialog } from "./product-add-update-dialog"
import { getUser, getUserAndPermissions, getUsers, loggedIn } from "@/app/services/auth"
import { getPermission } from "@/app/services/user-permissions"
import { FaFilePdf } from "react-icons/fa6"
import { getProducts } from "@/app/services/product"
// import { GetData } from "@/helper/getdata"
// import { GetUser } from "@/helper/getuser"



export type productType = {
    id: string,
    product_name: string,
    product_description: string,
    category_id: string,
    image_path: string,
    sale_price: number,
    created_at: Date,
    category_name: string,
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


export const ProductDataTable = (props: any) => {

    const columns: ColumnDef<productType>[] = [
        {
            accessorKey: "id",
            header: () => <div className="text-right">ID</div>,
            cell: ({ row }) => {
                const id = parseInt(row.getValue("id"))

                return <div className="text-center font-medium">{id}</div>
            },
        },
        {
            accessorKey: "image_path",
            header: () => <div>Image</div>,
            cell: ({ row }) => {
                let img_path = row.getValue("image_path")
                // { console.log(img_path) }
                if (img_path == "") {
                    img_path = defaultImage
                }

                return <div className="w-10 h-10">
                    {
                        <img className="rounded-full w-full h-full object-cover hover: hoverEffect" alt="preview-image" src={`${img_path}`} width={50} height={50} />
                    }
                </div>
            },
        },
        {
            accessorKey: "product_name",
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
            cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
        },
        {
            accessorKey: "product_description",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Description
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                let a: string = row.getValue("product_description")

                let slice_data = a;

                if (a.length >= 35) {
                    slice_data = a.slice(0, 50) + '...'
                }

                return (
                    <div className="lowercase">
                        {slice_data}
                    </div>
                )
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
                        Category
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("category_name")}</div>,
        },
        {
            accessorKey: "sale_price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("sale_price")}</div>,
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
                const product = row.original

                return (
                    <div className="flex flex-row items-center gap-1">
                        <ProductAddOrUpdateDialog data={{
                            id: product.id, category_id: product.category_id,
                            product_name: product.product_name, product_description: product.product_description,
                            image_path: product.image_path, sale_rate: product.sale_price.toString(), created_at: product.created_at
                        }} />
                        <DeleteProductDialog id={product.id} />
                    </div>
                )
            },
        },
    ]

    const response = props.response
    // console.log(response)
    const [newResponse, setNewResponse] = React.useState<productType[]>([])
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
    const data: productType[] = newResponse;
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
        router.push("reports/product")
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
                //  for profile resource id =5
                const permissionsDb = filterPermission.filter((p: any) => p.resource == 5)
                setPermissions(permissionsDb)
                const category_data = await getCategories()
                // console.log(category_data)

                // get response data
                const response = await getProducts();
                const productResponse = response;
                let arr = []
                for (let i = 0; i < productResponse.length; i++) {
                    const element = productResponse[i];
                    // get resource name
                    const filterCategoryData = category_data.filter((i: any) => i.id == element.category_id)
                    const category_name = filterCategoryData[0].category_name;

                    const newProductData: productType = {
                        'id': element.id,
                        'product_name': element.product_name,
                        'category_id': element.category_id,
                        'category_name': category_name,
                        'product_description': element.product_description,
                        'created_at': element.created_at,
                        'image_path': element.image_path,
                        'sale_price': element.sale_price,
                    }
                    arr.push(newProductData)
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
                        placeholder="Filter resource..."
                        value={(table.getColumn("product_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("product_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm mr-2"
                    />
                    <div className="w-full flex flex-row gap-1">
                        <ProductAddOrUpdateDialog data={{
                            id: "0", category_id: undefined, product_name: undefined,
                            product_description: undefined, image_path: undefined, sale_rate: undefined,
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
