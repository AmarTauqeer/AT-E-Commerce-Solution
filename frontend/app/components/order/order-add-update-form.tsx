"use client";
import React, { Dispatch, FormEvent, FormEventHandler, MouseEventHandler, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"

import { toast } from "sonner";
import { orderAddOrUpdateFormData } from "@/app/services/order";
import { deleteOrderItems, orderItemsAddOrUpdateFormData } from "@/app/services/order-items";
import OrderItemsTable from "./order-items-table";
import { DeleteOrderItemsData } from "@/app/services/helper/delete_data";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

export const addOrUpdateSchema = z.object({
    id: z.number(),
    user: z.string().min(1, "User can't be empty!"),
    order_status: z.string().min(1, "Order status is required!"),
    order_amount: z.number().min(1, "Order amount can't be empty!"),
})

export type AddOrUpdate = {
    data: {
        id: string | undefined,
        user: string | undefined,
        email: string | undefined,
        order_status: string | undefined,
        order_amount: number | undefined,
        created_at?: Date,
        users: {}[],
        products: {}[],
        orderItems: {}[]
    },
    setIsOpen: Dispatch<SetStateAction<boolean>>
}



const OrderAddEditForm = (props: AddOrUpdate) => {
    const currentDate: Date = new Date();
    const [loading, setLoading] = useState(false);
    const [orderItems, setOrderItems] = useState([])
    const [filterLineItems, setFilterLineItems] = useState<any>()
    // const [selectedUser, setSelectedUser] = useState("amar.tauqeer@gmail.com")

    const router = useRouter();
    let users = props.data.users
    let products = props.data.products
    console.log(products)

    let tempData: any;
    if (props.data.id !== undefined) {
        let id = props.data.id
        tempData = props.data.orderItems.filter((item: any) => item.order_id == parseInt(id))
    }
    // console.log(tempData)
    // let filterLineItems:any;


    const form = useForm<z.infer<typeof addOrUpdateSchema>>({
        defaultValues: {
            id: 0,
            user: "2",
            order_status: "Created",
            order_amount: 100,
        },
        resolver: zodResolver(addOrUpdateSchema),
    })

    async function onSubmit(data: z.infer<typeof addOrUpdateSchema>) {
        // console.log(data)
        // console.log(orderItems)


        let order_amount = 0;
        orderItems.forEach((element: any) => {
            const amount = parseInt(element.purchase_price) * parseInt(element.quantity)
            order_amount += amount;
        });



        // master data

        let insertOrUpdate = "Insert"

        if (data.id >= 1) {
            insertOrUpdate = "Update"
        }

        // setLoading(true);
        type dataType = {
            id?: number,
            user_id: number,
            created_at?: Date,
            updated_at?: Date,
            order_status: string,
            order_amount: number,
        }

        type orderItem = {
            id?: number,
            created_at?: Date,
            updated_at?: Date,
            order_id: number,
            product_id: number,
            purchase_price: number,
            quantity: number
        }

        let orderId: any;
        if (data) {
            if (data.id != undefined) {
                orderId = data.id
            }
        }

        let formData: dataType;
        let formDataOrderItems: orderItem

        if (orderId == 0) {
            formData = {
                id: 0,
                user_id: parseInt(data.user),
                order_status: data.order_status,
                order_amount: order_amount,
                created_at: currentDate,
                updated_at: currentDate
            }
        } else {
            formData = {
                id: data.id,
                user_id: parseInt(data.user),
                order_status: data.order_status,
                order_amount: order_amount,
                created_at: currentDate,
                updated_at: currentDate
            }
        }

        // add or update
        const response = await orderAddOrUpdateFormData(formData)
        // console.log(response)
        if (response.id!=undefined) {
            // adding lineitems
            let orderIdDb = response.id;


            // delete lineitems deleted by user
            const result = tempData.filter(
                (item: { id: number }) =>
                    !orderItems.some(
                        (obj: { id: number }) => obj.id === item.id
                    )
            );
            if (result.length > 0) {
                async function deleteItems() {
                    for (const r of result) {
                        // console.log(r.id)
                        const responseDelete = await deleteOrderItems(r.id)
                        console.log(responseDelete)
                    }
                }
                deleteItems()
            }



            orderItems.forEach((item: any) => {
                if (orderId == 0) {
                    formDataOrderItems = {
                        id: 0,
                        order_id: orderIdDb,
                        product_id: parseInt(item.product_id),
                        quantity: parseInt(item.quantity),
                        purchase_price: parseInt(item.purchase_price),
                    }
                    console.log(formDataOrderItems.order_id + ' insert')
                    async function insertOrderItems() {
                        const responseOrderItems = await orderItemsAddOrUpdateFormData(formDataOrderItems)
                        // console.log(responseOrderItems)
                    }
                    insertOrderItems()

                } else {
                    let orderItemId = item.id

                    // check if new item
                    // console.log(item.product_id)
                    if (orderItemId == undefined) {
                        async function insertNewItems() {
                            formDataOrderItems = {
                                id: 0,
                                order_id: orderId,
                                product_id: parseInt(item.product_id),
                                quantity: parseInt(item.quantity),
                                purchase_price: parseInt(item.purchase_price),
                                created_at: currentDate,
                                updated_at: currentDate
                            }
                            // console.log(formDataOrderItems.order_id + ' insert if item is not already there')
                            const responseOrderItems = await orderItemsAddOrUpdateFormData(formDataOrderItems)
                            orderItemId = await responseOrderItems.id
                            // console.log(responseOrderItems)
                        }
                        insertNewItems()
                    } else {
                        // console.log(orderItemId)
                        formDataOrderItems = {
                            id: orderItemId,
                            order_id: orderId,
                            product_id: parseInt(item.product_id),
                            quantity: parseInt(item.quantity),
                            purchase_price: parseInt(item.purchase_price),
                            created_at: currentDate,
                            updated_at: currentDate
                        }
                        // console.log(formDataOrderItems)
                        // console.log(formDataOrderItems.order_id + ' update')
                        async function updateOrderItems() {
                            const responseOrderItems = await orderItemsAddOrUpdateFormData(formDataOrderItems)
                            // console.log(responseOrderItems)
                        }
                        updateOrderItems()
                    }
                }
            });

            router.replace("/customer-order")
            setLoading(false)
            props.setIsOpen(false);
            toast.success(<span className="text-green-500">{insertOrUpdate} Successful.</span>)
            setTimeout(() => {
                setLoading(false);
            }, 10000);

        } else {
            toast.error(<span className="text-red-500">{insertOrUpdate} Failed.</span>)
            setLoading(false)
            return false;
        }

    }

    const handleUpdateData = (data: any) => {
        const jsonData = JSON.parse(data)
        // console.log(jsonData)
        // console.log(jsonData + 'handle update data')
        if (jsonData) {
            setOrderItems(jsonData)
        }
        const getProductsData = () => {
            return products
        }
        const getOrderItemsData = () => {
            return tempData
        }
    }
    type selectedUserDataType = {
        email: string
    }

    useEffect(() => {
        let recData = props.data
        console.log(recData)

        if (recData) {
            let userId = "2", id = "0", order_status = "Created", order_amount = 1;

            if (recData.user !== undefined) {
                userId = recData.user.toString()
                // const filterUser = users.filter((u: any) => u.id == parseInt(userId))
                // filterUser.forEach((element: any) => {
                //     setSelectedUser(element.email)
                // });
            }
            if (recData.id !== undefined) {
                id = recData.id
            }
            if (recData.order_status !== undefined) {
                order_status = recData.order_status
            }
            if (recData.order_amount !== undefined) {
                order_amount = recData.order_amount
            }

            let defaultValues = {
                id: parseInt(id),
                user: userId,
                order_status: order_status,
                order_amount: order_amount
            }
            form.reset({ ...defaultValues })
        }
    }, [props, form.reset])


    return (
        <>
            <div className="flex justify-center items-center w-full">

                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">

                    <Controller
                        name="user"
                        control={form.control}
                        render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                <div className="flex md:flex-row lg:flex-row xl:flex-row items-center gap-2">
                                    <div className="col-span-2 w-full">
                                        <FieldContent >
                                            <FieldLabel htmlFor={field.name}>
                                                Customer
                                            </FieldLabel>
                                        </FieldContent>
                                    </div>
                                    <div className="col-span-2 w-full">
                                        <Select
                                            value={field.value}
                                            onValueChange={onChange}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid} onBlur={onBlur} id={field.name}>
                                                <SelectValue placeholder="Select a user" />
                                            </SelectTrigger>
                                            <SelectContent className="col-span-1">

                                                {users.length > 0 && users.map((u: any, index) => (
                                                    <SelectItem key={u.id} value={String(u.id)}>
                                                        {u.email}
                                                    </SelectItem>
                                                ))}

                                            </SelectContent>
                                        </Select>

                                        <FieldContent>
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </FieldContent>
                                    </div>
                                </div>
                            </Field>

                        )}
                    />

                    <Controller
                        name="order_status"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="flex md:flex-row lg:flex-row xl:flex-row items-center gap-2">
                                    <div className="col-span-2 w-full">
                                        <FieldContent>
                                            <FieldLabel htmlFor={field.name}>
                                                Status
                                            </FieldLabel>
                                        </FieldContent>
                                    </div>
                                    <div className="col-span-2 w-full">
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full max-w-48">
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="Created">Created</SelectItem>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                </div>
                            </Field>
                        )}
                    />
                    <div className="flex md:flex-row lg:flex-row xl:flex-row items-center gap-2">
                        <div className="col-span-2 w-full">{" "}</div>
                        <div className="col-span-2 w-full">{" "}</div>
                    </div>


                </div>

            </div>
            <div className="">
                <div>{filterLineItems}</div>
                <OrderItemsTable onDataUpdate={handleUpdateData} getProductsData={products} getOrderItemsData={tempData} />
            </div>
            <div className="flex flex-row justify-center">
                <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                    <Button variant="default" type="submit" onClick={form.handleSubmit(onSubmit)}
                        disabled={loading}>
                        {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                        {!loading && <p>Submit</p>}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => props.setIsOpen(false)}>Cancel</Button>
                </div>
            </div>
        </>
    )
};

export default OrderAddEditForm;
