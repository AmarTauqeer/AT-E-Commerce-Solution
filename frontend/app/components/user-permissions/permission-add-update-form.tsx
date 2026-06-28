"use client";
import React, { Dispatch, FormEvent, FormEventHandler, MouseEventHandler, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { boolean, int, number, string } from "zod"

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { permissionAddOrUpdateFormData } from "@/app/services/user-permissions";
import { getUsers } from "@/app/services/auth";
import { Checkbox } from "../ui/checkbox";
import { getResources } from "@/app/services/resource";

export const addOrUpdateSchema = z.object({
    id: z.number(),
    resource: z.string(),
    user: z.string(),
    read: z.boolean(),
    write: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),

})

export type AddOrUpdate = {
    data: {
        id: string | undefined,
        user: string | undefined,
        resource: string | undefined,
        Read?: boolean | false
        Write?: boolean | false
        Update?: boolean | false
        Delete?: boolean | false

    },
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const PermissionsAddEditForm = (props: AddOrUpdate) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [resourceData, setResourceData] = useState([])
    const [userData, setUserData] = useState([])

    const form = useForm<z.infer<typeof addOrUpdateSchema>>({
        defaultValues: {
            resource: "1",
            id: 1,
            user: "2",
            read: false,
            write: false,
            update: false,
            delete: false,
        },
        resolver: zodResolver(addOrUpdateSchema),
    })

    async function onSubmit(data: z.infer<typeof addOrUpdateSchema>) {

        setLoading(true);
        type dataType = {
            id?: number,
            resource: number,
            created_at?: Date,
            updated_at?: Date,
            user: number,
            Read: boolean,
            Write: boolean,
            Update: boolean,
            Delete: boolean,
        }

        let permissionId;
        if (data) {
            if (data.id) {
                permissionId = data.id
            }
        }


        let formData: dataType;

        if (permissionId == 0) {
            formData = {
                id: 0,
                resource: parseInt(data.resource),
                user: parseInt(data.user),
                Read: data.read,
                Write: data.write,
                Update: data.update,
                Delete: data.delete
            }
        } else {
            formData = {
                id: data.id,
                resource: parseInt(data.resource),
                user: parseInt(data.user),
                Read: data.read,
                Write: data.write,
                Update: data.update,
                Delete: data.delete,
            }
        }

        // add or update
        const response = await permissionAddOrUpdateFormData(formData)

        if (response) {
            // update localStorage

            // const tempData = localStorage.getItem("permissions")
            // const role_name = localStorage.getItem("role_name")
            // if (tempData != null) {
            //     const permissions = JSON.parse(tempData)
            //     // const permision = jsonLocalData
            //     let arr: any = []

            //     permissions.forEach((element: any) => {
            //         let read = element.Read, write = element.Write, update = element.Update, deletep = element.Delete
            //         if (element.resource == parseInt(data.resource)) {
            //             read = data.read;
            //             write = data.write;
            //             deletep = data.delete;
            //             update = data.update;
            //         }

            //         const updatedData = {
            //             'resource': element.resource,
            //             'Read': read,
            //             'Write': write,
            //             'Update': update,
            //             'Delete': deletep,
            //             'id': element.id,
            //             'user': element.user,
            //             'created_at': element.created_at,
            //             'updated_at': element.updated_at,
            //         }
            //         arr.push(updatedData)
            //     });

            //     localStorage.removeItem("permissions")
            //     localStorage.setItem("permissions", JSON.stringify(arr))

            router.replace("/user-permissions")
            props.setIsOpen(false);
            setLoading(false)

            setTimeout(() => {
                setLoading(false);
            }, 10000);

        } else {
            props.setIsOpen(false)
            return false;
        }
        // }
    }



    const handleCancel = (e: MouseEventHandler<HTMLButtonElement>) => {
        props.setIsOpen(false);
    }


    useEffect(() => {
        let recData = props.data
        if (recData) {
            if (resourceData.length == 0) {
                const getResourceData: any = async () => {
                    const rep = await getResources()
                    setResourceData(rep)
                    // get user data
                    const usersResponse = await getUsers()
                    setUserData(usersResponse)

                    //check for resource id and user id
                    if (rep) {
                        let resId, userId, id = "0";
                        let read = false, write = false, update = false, deleteRight = false;
                        // user rights
                        if (recData.Read !== undefined) {
                            read = recData.Read;
                        }
                        if (recData.Write !== undefined) {
                            write = recData.Write;
                        }
                        if (recData.Update !== undefined) {
                            update = recData.Update;
                        }
                        if (recData.Delete !== undefined) {
                            deleteRight = recData.Delete
                        }
                        if (recData.user !== undefined) {
                            userId = parseInt(recData.user)
                        }
                        if (recData.id !== undefined) {
                            id = recData.id
                        }

                        if (recData.resource !== undefined && recData.user !== undefined) {
                            const resourceId = recData.resource
                            const idInString = resourceId.toString()
                            resId = idInString
                            userId = recData.user.toString()
                        } else {
                            resId = "1"
                            userId = "1"
                        }

                        let defaultValues = {
                            resource: resId,
                            id: parseInt(id),
                            user: userId,
                            read: read,
                            write: write,
                            update: update,
                            delete: deleteRight,
                        }
                        console.log(defaultValues)
                        form.reset({ ...defaultValues })
                    }
                }
                getResourceData()
            }
        }
    }, [props, form.reset])

    return (
        <div>
            {userData.length > 0 && <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="user"
                        control={form.control}
                        render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    User
                                </FieldLabel>
                                <Select {...field} onValueChange={onChange}>
                                    <SelectTrigger aria-invalid={fieldState.invalid} onBlur={onBlur} id={field.name}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userData.length > 0 && userData.map((u: { id: string, first_name: string }, index) => (
                                            <SelectItem key={index} value={u.id.toString()}>
                                                {u.first_name}
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
                </FieldGroup>
                <FieldGroup>
                    <Controller
                        name="resource"
                        control={form.control}
                        render={({ field: { onChange, onBlur, ...field }, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Resource
                                </FieldLabel>
                                <Select {...field} onValueChange={onChange}>
                                    <SelectTrigger aria-invalid={fieldState.invalid} onBlur={onBlur} id={field.name}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {resourceData.length > 0 && resourceData.map((r: { id: string, resource_name: string }, index) => (
                                            <SelectItem key={index} value={r.id.toString()}>
                                                {r.resource_name}
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
                </FieldGroup>
                <FieldSet>
                    <FieldContent>
                        <FieldLegend>User Permissions</FieldLegend>
                        <FieldDescription>
                            How would you like to give permissions!
                        </FieldDescription>
                    </FieldContent>
                    <FieldGroup data-slot="checkbox-group">
                        <Controller
                            name="read"
                            control={form.control}
                            render={({ field: { value, onChange, ...field }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">

                                    <Checkbox {...field}
                                        id={field.name}
                                        checked={value}
                                        onCheckedChange={onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor={field.name}>
                                        Read
                                    </FieldLabel>
                                    <FieldContent>
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </FieldContent>

                                </Field>
                            )}
                        />
                        <Controller
                            name="write"
                            control={form.control}
                            render={({ field: { value, onChange, ...field }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">

                                    <Checkbox {...field}
                                        id={field.name}
                                        checked={value}
                                        onCheckedChange={onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor={field.name}>
                                        Write
                                    </FieldLabel>
                                    <FieldContent>
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </FieldContent>

                                </Field>
                            )}
                        />
                        <Controller
                            name="update"
                            control={form.control}
                            render={({ field: { value, onChange, ...field }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">

                                    <Checkbox {...field}
                                        id={field.name}
                                        checked={value}
                                        onCheckedChange={onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor={field.name}>
                                        Update
                                    </FieldLabel>
                                    <FieldContent>
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </FieldContent>

                                </Field>
                            )}
                        />
                        <Controller
                            name="delete"
                            control={form.control}
                            render={({ field: { value, onChange, ...field }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">

                                    <Checkbox {...field}
                                        id={field.name}
                                        checked={value}
                                        onCheckedChange={onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor={field.name}>
                                        Delete
                                    </FieldLabel>
                                    <FieldContent>
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </FieldContent>

                                </Field>
                            )}
                        />
                    </FieldGroup>

                </FieldSet>


                <div className="grid grid-cols-2 gap-2 mt-6">

                    <Button variant="default" type="submit" onClick={(e) => { e.stopPropagation(); form.handleSubmit(onSubmit) }} disabled={loading}>
                        {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
                        {!loading && <p>Submit</p>}
                    </Button>
                    <Button className="grid-cols-1" variant="outline" type="button" onClick={() => props.setIsOpen(false)}>Cancel</Button>
                </div>

            </form >}
        </div>


    )
};

export default PermissionsAddEditForm;
