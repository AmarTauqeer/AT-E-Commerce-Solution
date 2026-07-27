"use client";
import React, { Dispatch, FormEvent, FormEventHandler, MouseEventHandler, SetStateAction, useEffect, useState } from "react";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { format } from "date-fns"

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { boolean, int, number, string, unknown } from "zod"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import { toast } from "sonner";
import { categoryAddOrUpdateFormData, getCategories } from "@/app/services/category";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export const addOrUpdateSchema = z.object({
    id: z.string(),
    category_name: z.string().min(1, "Category name is required!"),
})

export type AddOrUpdate = {
    data: {
        id: string | undefined,
        category_name: string | undefined,
        created_at?: Date,
        updated_at?: Date
    },
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const CategoryAddEditForm = (props: AddOrUpdate) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [userData, setUserData] = useState([])
    const [createDate, setCreateDate] = useState<Date>()
    const [openCreateDateFrom, setOpenCreateFrom] = useState(false);

    const form = useForm<z.infer<typeof addOrUpdateSchema>>({
        defaultValues: {
            id: "0",
            category_name: "",
        },
        resolver: zodResolver(addOrUpdateSchema),
    })

    async function onSubmit(data: z.infer<typeof addOrUpdateSchema>) {
        let insertOrUpdate = "Insert"
        let date= new Date();

        if (parseInt(data.id) >= 1) {
            insertOrUpdate = "Update"
        }
        
        if (createDate!=undefined) {
            date= new Date(format(createDate,'yyyy-MM-dd'))
        }

        const postData = {
            id: data.id,
            category_name: data.category_name,
            created_at: date,
            // created_at: props.data.created_at,
            updated_at: date
        }

        const response = await categoryAddOrUpdateFormData(postData)

        if (response.category_name != undefined) {
            router.replace("/category")
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

            let created_at, category_name = "", id = "0";

            if (recData.id != undefined
                && recData.category_name != undefined) {
                id = recData.id.toString()
                category_name = recData.category_name
                created_at = recData.created_at
                setCreateDate(recData.created_at)
            }

            let defaultValues = {
                id: id,
                catetgory_name: category_name,
            }
            // console.log(JSON.stringify(defaultValues) + ' from useeffect')
            form.setValue("id", id)
            form.setValue("category_name", category_name)
            // form.setValue("category_id",categoryId)
            // form.reset({ ...defaultValues })
        }
    }, [props, form.setValue])

    return (
        <>
            <Form {...form}>
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
                                    name="category_name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="category-name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="category-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Category name"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                            </FieldGroup>

                            <div className="grid grid-cols-2 gap-2 mt-6">

                                <Button variant="default" type="submit" onClick={(e) => { e.stopPropagation(); form.handleSubmit(onSubmit) }} disabled={loading}>
                                    {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                                    {!loading && <p>Submit</p>}
                                </Button>
                                <Button className="grid-cols-1" variant="outline" type="button" onClick={() => props.setIsOpen(false)}>Cancel</Button>
                            </div>

                        </div>
                    </div>

                </form >
            </Form>

        </>
    )
};

export default CategoryAddEditForm;
