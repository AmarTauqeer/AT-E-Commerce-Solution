import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "../ui/button";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


type EventFormProps = {
    onDataUpdate: (data: any) => void;
    getProductsData: any;
    getOrderItemsData: any;
};

export const itemSchema = z.object({
    product_id: z.string().min(1, "Product is required"),
    purchase_price: z.string().min(1, "Price is required"),
    quantity: z.string().min(1, "Quantity is required"),
    amount_per_product: z.number(),
})

const schema = z.object({
    orderItems: z.array(itemSchema).min(1, 'item required!')
});
export type OrderItemsFormValues = z.infer<typeof schema>;

const OrderItemsTable = ({ onDataUpdate, getProductsData, getOrderItemsData }: EventFormProps) => {

    const [productData, setProductData] = useState(getProductsData ?? [])
    const [orderItemsData, setOrderItemsData] = useState(getOrderItemsData ?? [])

    const[selectedProduct, setSelectedProduct] = useState("1")


    let purchase_price_str = (productData[0].sale_price).toString()
    let product_id = (productData[0].id).toString()
    let amount_per_product = productData[0].sale_price * 1

    const { control, register, formState, getValues, setValue } = useForm<OrderItemsFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            orderItems: orderItemsData.length > 0 ? orderItemsData : [{
                product_id: product_id, quantity: "1", purchase_price: purchase_price_str,
                amount_per_product: amount_per_product
            }]
        },
        mode: "onChange",
    });

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "orderItems"
    });

    const items = useWatch({
        control: control,
        name: "orderItems",
    });
    const total = items?.reduce((sum: any, item: any) => sum + item.purchase_price * item.quantity, 0) || 0;

    // Add a new row
    const addRow = () => {
        if (orderItemsData.length > 0) {
            product_id = orderItemsData[0].product_id
            purchase_price_str = orderItemsData[0].purchase_price
            amount_per_product = parseInt(orderItemsData[0].purchase_price) * 1
        }
        console.log("product id = " + product_id + " purchase price = " + purchase_price_str + " amount_per_product = " + amount_per_product)
        prepend({
            product_id: product_id,
            purchase_price: purchase_price_str,
            quantity: "1",
            amount_per_product: amount_per_product,
        });
        const values = getValues()
        const jsonData = JSON.stringify(values.orderItems)
        onDataUpdate(jsonData)
    };

    // Delete a specific row
    const deleteRow = (index: number) => {
        remove(index);
        const values = getValues()
        const jsonData = JSON.stringify(values.orderItems)
        onDataUpdate(jsonData)
    };

    useEffect(() => {
        const values = getValues()
        console.log(values.orderItems)
        const filterProducts = productData.filter((p: any) => p.id == parseInt(values.orderItems[0].product_id))
        filterProducts.forEach((element: any) => {
            setSelectedProduct(element.product_name)
        });

        const jsonData = JSON.stringify(values.orderItems)
        // console.log(jsonData)
        onDataUpdate(jsonData)
    }, [])

    return (
        <div className="">

            <header className="flex justify-between py-5">
                <span className="text-2xl">Order Item</span>
                <Button
                    onClick={addRow}
                >
                    Add Row
                </Button>
            </header>
            <div
                className="p-1 shadow-lg"
            >
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 text-sm font-semibold">
                                Product
                            </th>
                            <th className="px-4 text-sm font-semibold">
                                Quantity
                            </th>
                            <th className="px-4 text-sm font-semibold">
                                Price
                            </th>
                            <th className="px-4 text-sm font-semibold">
                                Amount
                            </th>
                            <th className="px-4 text-sm font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fields.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="transition duration-200"
                                >
                                    <td className="border border-dashed border-gray-100 px-4 w-60">

                                        <Controller
                                            name={`orderItems.${index}.product_id`}
                                            control={control}
                                            render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid} className="pt-2.5">
                                                    <Select {...field}
                                                        onValueChange={(value:any) => {
                                                            if (value) {
                                                                setValue(`orderItems.${index}.product_id`,value)
                                                                const filterProducts = productData.filter((p: any) => p.id == parseInt(value))
                                                                filterProducts.forEach((element: any) => {
                                                                    setSelectedProduct(element.product_name)
                                                                });

                                                            }
                                                        }}
                                                        value={field.value}
                                                        onOpenChange={() => {
                                                            const values = getValues()
                                                            const jsonData = JSON.stringify(values.orderItems)
                                                            onDataUpdate(jsonData)
                                                        }}
                                                    >
                                                        <SelectTrigger aria-invalid={fieldState.invalid} onBlur={onBlur} id={field.name}>
                                                            <SelectValue />
                                                                {/* {selectedProduct} */}
                                                            {/* </SelectValue> */}
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {productData.length > 0 && productData.map((c: { id: string, product_name: string }, index: any) => (
                                                                <SelectItem key={index} value={c.id.toString()}>
                                                                    {c.product_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <FieldContent>
                                                        {fieldState.error && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </FieldContent>

                                                </Field>
                                            )}
                                        />
                                    </td>
                                    <td className="border border-dashed border-gray-100 px-4 w-20">
                                        <Controller
                                            name={`orderItems.${index}.quantity`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? 1}
                                                        id={field.name}
                                                        onSelect={() => {
                                                            const values = getValues()
                                                            const jsonData = JSON.stringify(values.orderItems)
                                                            onDataUpdate(jsonData)
                                                        }}
                                                        onChange={(e) => {
                                                            setValue(`orderItems.${index}.quantity`, e.target.value)
                                                            const price = getValues(`orderItems.${index}.purchase_price`);
                                                            const quantity = e.target.value;
                                                            setValue(`orderItems.${index}.amount_per_product`, parseInt(price) * parseInt(quantity))
                                                        }}
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="quantity"
                                                        autoComplete="off"
                                                        className="text-center"
                                                        // className="text-center rounded border border-gray-500 bg-gray-800 p-1 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                    </td>
                                    <td className="border border-dashed border-gray-100 px-4 w-20">
                                        <Controller
                                            name={`orderItems.${index}.purchase_price`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? 1}
                                                        id={field.name}
                                                        onSelect={() => {
                                                            const values = getValues()
                                                            const jsonData = JSON.stringify(values.orderItems)
                                                            onDataUpdate(jsonData)
                                                        }}
                                                        onChange={(e) => {
                                                            setValue(`orderItems.${index}.purchase_price`, e.target.value)
                                                            const price = e.target.value;
                                                            const quantity = getValues(`orderItems.${index}.quantity`);
                                                            setValue(`orderItems.${index}.amount_per_product`, parseInt(price) * parseInt(quantity))
                                                        }}

                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="purchase_price"
                                                        autoComplete="off"
                                                        className="text-end"
                                                        // className="text-end rounded border border-gray-500 bg-gray-800 p-1 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                    </td>
                                    <td className="border border-dashed border-gray-100 px-4 w-20">
                                        <Controller
                                            name={`orderItems.${index}.amount_per_product`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? 1}
                                                        id={field.name}
                                                        autoComplete="off"
                                                        disabled
                                                        className="text-end"
                                                        // className="text-end rounded border border-gray-500 bg-gray-800 p-1 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </Field>
                                            )}
                                        />
                                    </td>
                                    <td className="border border-dashed border-gray-100 px-4 w-20">
                                        <div
                                            onClick={() => {
                                                deleteRow(index);
                                            }}
                                            className="w-20 py-2 rounded bg-red-500 px-4 text-sm text-white transition duration-200 hover:bg-red-600"
                                        >
                                            Delete
                                        </div>
                                    </td>

                                </tr>
                            ))
                        }

                        <tr className="text-white text-lg font-semibold">
                            <td className="border border-dashed border-gray-100 px-4 w-60">
                                {""}
                            </td>
                            <td className="border border-dashed border-gray-100 px-4 w-60">
                                {""}
                            </td>
                            <td className="border border-dashed border-gray-100 px-4 w-60">
                                Grand Total
                            </td>
                            <td className="border border-dashed border-gray-100 px-4 w-60 text-end">
                                {total}
                            </td>
                            <td className="border border-dashed border-gray-100 px-4 w-60">
                                {""}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderItemsTable;