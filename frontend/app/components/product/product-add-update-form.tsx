"use client";
import React, { Dispatch, FormEvent, FormEventHandler, MouseEventHandler, SetStateAction, useEffect, useState } from "react";
import { ChevronDownIcon, ImageUp, Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { boolean, int, number, string, unknown } from "zod"
export const defaultImage = "default_img.png"
export const defaultImage1 = "placeholder.svg"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

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

import Image from "next/image";
import { toast } from "sonner";
import { getCategories } from "@/app/services/category";
import { Button } from "../ui/button";
import { productAddOrUpdateFormData } from "@/app/services/product";
import { Form } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns"

export const addOrUpdateSchema = z.object({
    id: z.string(),
    category_id: z.string({ message: "Category is required!" }).min(1),
    product_name: z.string().min(1, "Product name is required!"),
    product_description: z.string().min(1, "Product desription is required!"),
    sale_rate: z.string().min(1, "Sale rate must be greater or equal 1!"),
    file_upload: z
        .instanceof(File)
        .optional()
        .refine(
            (file) =>
                !file ||
                ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            {
                message: "Only JPG, PNG, and WebP images are allowed",
            }
        ),
})

export type AddOrUpdate = {
    data: {
        id: string | undefined,
        product_name: string | undefined,
        product_description: string | undefined,
        sale_rate: string | undefined,
        category_id: string | undefined,
        image_path: string | undefined
        created_at?: Date
    },
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const ProductAddEditForm = (props: AddOrUpdate) => {
    const [file, setFile] = useState(null)
    const [imageUrl, setImageUrl] = useState("")

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [categoryData, setCategoryData] = useState([])
    const [userData, setUserData] = useState([])

    const [createDate, setCreateDate] = useState<Date>()
    const [openCreateDateFrom, setOpenCreateFrom] = useState(false);

    const form = useForm<z.infer<typeof addOrUpdateSchema>>({
        defaultValues: {
            category_id: "1",
            id: "0",
            product_name: "",
            product_description: "",
            sale_rate: "1",
        },
        resolver: zodResolver(addOrUpdateSchema),
    })

    async function onSubmit(data: z.infer<typeof addOrUpdateSchema>) {

        let insertOrUpdate = "Insert"

        if (parseInt(data.id) >= 1) {
            insertOrUpdate = "Update"
        }

        const formObj = new FormData()
        // console.log(data.file_upload)
        if (data.file_upload) {
            formObj.append('file_upload', data.file_upload)
        }




        // if (createDate!=undefined) {
        //     let temp=0;
        //     console.log(createDate.toString())
        //     temp = createDate.toString().length
        //     console.log(temp)
        //     if (temp==64) {
        //         formObj.append('created_at', createDate.toISOString())
        //     }
        // }

        // if (createDate!=undefined) {
        //     if (props.data!=undefined && props.data.created_at!=undefined) {
        //         console.log('not 0')
        //         console.log(typeof(props.data.created_at))
        //         formObj.append('created_at', new Date(props.data.created_at).toISOString())
        //     }else{
        //         formObj.append('created_at', createDate.toISOString())
        //     }
        // }


        formObj.append('id', data.id)
        formObj.append('category_id', data.category_id)
        formObj.append('product_name', data.product_name)
        formObj.append('product_description', data.product_description)
        formObj.append('sale_price', data.sale_rate)

        if (createDate != undefined) {
            formObj.append('created_at', format(createDate, 'yyyy-MM-dd'))
        }

        // formObj.values().forEach(element => {
        //     console.log(element)
        // });

        const response = await productAddOrUpdateFormData(formObj)
        console.log(response)


        if (response.category_id != undefined) {
            router.replace("/product")
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


    const handleCancel = (e: MouseEventHandler<HTMLButtonElement>) => {
        props.setIsOpen(false);
    }


    useEffect(() => {
        let recData = props.data
        // console.log(recData)
        if (recData) {
            if (categoryData.length == 0) {
                const getCategory: any = async () => {
                    const rep = await getCategories()
                    setCategoryData(rep)

                    if (rep) {
                        let created_at, categoryId = "1", product_name = "",
                            product_description = "", sale_rate = "1", image_path = "", id = "0";

                        if (recData.id != undefined
                            && recData.product_name != undefined
                            && recData.product_description != undefined
                            && recData.sale_rate != undefined
                            && recData.image_path !== undefined) {
                            id = recData.id.toString()
                            product_name = recData.product_name
                            product_description = recData.product_description,
                                sale_rate = recData.sale_rate.toString(),
                                image_path = recData.image_path
                            // categoryId = recData.category_id.toString()
                            created_at = recData.created_at
                            setCreateDate(created_at)
                        }

                        if (recData.category_id !== undefined) {
                            const catId = recData.category_id
                            const idInString = catId.toString()
                            categoryId = idInString
                        } else {
                            categoryId = "1"
                        }
                        // image preview
                        if (image_path == "" || image_path == "None") {
                            image_path = defaultImage1
                        }
                        setImageUrl(image_path)

                        let defaultValues = {
                            category_id: categoryId,
                            id: id,
                            product_name: product_name,
                            product_description: product_description,
                            sale_rate: sale_rate,
                            image_path: image_path,
                        }
                        // console.log(JSON.stringify(defaultValues) +' from useeffect')
                        // form.setValue("category_id",categoryId)
                        form.reset({ ...defaultValues })
                    }
                }
                getCategory()
            }
        }
    }, [props, form.reset])

    return (
        <>
            {categoryData.length > 0 && <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="">
                            <FieldGroup>
                                <FieldLabel htmlFor="date">
                                    Date
                                </FieldLabel>
                                <Popover open={openCreateDateFrom} onOpenChange={setOpenCreateFrom}>
                                    <PopoverTrigger render={<Button variant={"outline"} data-empty={!createDate} className="mb-3 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">{createDate ? format(createDate, "PPP") : <span>Pick a date</span>}<ChevronDownIcon data-icon="inline-end" /></Button>} />
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={createDate}
                                            onSelect={(selectedDate) => { setCreateDate(selectedDate); setOpenCreateFrom(false) }}
                                            defaultMonth={createDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FieldGroup>
                            <FieldGroup>
                                <Controller
                                    name="product_name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="product-name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="product-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Product name"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="product_description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-description">
                                                Description
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="form-rhf-demo-description"
                                                    placeholder="Product description"
                                                    rows={6}
                                                    className="min-h-24 resize-none"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                            </InputGroup>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    <Controller
                                        name="category_id"
                                        control={form.control}
                                        render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Category
                                                </FieldLabel>
                                                <Select value={field.value} onValueChange={onChange}>
                                                    <SelectTrigger aria-invalid={fieldState.invalid} onBlur={onBlur} id={field.name}>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryData.length > 0 && categoryData.map((c: any, index) => (
                                                            <SelectItem key={index} value={c.id.toString()}>
                                                                {c.category_name}
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
                                    <Controller
                                        name="sale_rate"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="sale_rate">
                                                    Price
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="sale_rate"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Price"
                                                    autoComplete="off"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </FieldGroup>
                            <div className="grid grid-cols-2 gap-2 mt-6">
                                <Button variant="default" type="submit" onClick={(e) => { e.stopPropagation(); form.handleSubmit(onSubmit) }} disabled={loading}>
                                    {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                                    {!loading && <p>Submit</p>}
                                </Button>
                                <Button className="grid-cols-1" variant="outline" type="button" onClick={() => props.setIsOpen(false)}>Cancel</Button>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <div>
                                {
                                    imageUrl &&
                                    <img src={imageUrl} className="rounded-2xl w-full" alt="preview-image" />
                                }
                            </div>
                            <Controller
                                name="file_upload"
                                control={form.control}
                                render={({ field: { ref, name, onBlur, onChange } }) => {
                                    return (
                                        <input
                                            type="file"
                                            className="px-2 hover:cursor-pointer"
                                            ref={ref}
                                            accept="image/*"
                                            name={name}
                                            onBlur={onBlur}
                                            onChange={(e) => {
                                                const currFile = e.target.files?.[0];
                                                // console.log(currFile)
                                                if (currFile) {
                                                    const url = URL.createObjectURL(currFile)
                                                    setImageUrl(url)
                                                }
                                                onChange(currFile ? currFile : "");
                                            }}
                                        />
                                    );
                                }}
                            />
                        </div>

                    </div>

                </form >
            </Form>}

        </>
    )
};

export default ProductAddEditForm;
