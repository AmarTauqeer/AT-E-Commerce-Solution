'use client'
import { Button } from "@/components/ui/button"
import { BiSolidEdit } from "react-icons/bi";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect, useRouter } from "next/navigation"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"
import ProductAddEditForm from "./product-add-update-form";

export type receiveDataType = {
    data: {
        id: string | undefined,
        category_id: string | undefined,
        product_name: string | undefined,
        product_description: string | undefined,
        image_path: string | undefined,
        sale_rate: string | undefined,
        created_at?: Date,
    }
}

export function ProductAddOrUpdateDialog({ data }: receiveDataType) {
    const router = useRouter()
    let { id, category_id, product_name, product_description, sale_rate, image_path, created_at } = data;

    const [isOpen, setIsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [categoryInput, setCategoryInput] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false);

    const handleOnchage = () => {
        setIsOpen(!isOpen);
    }

    const onChange = (e: FormEvent<HTMLInputElement>) => {
        setCategoryInput(e.currentTarget.value);
    };

    useEffect(() => {
        if (id !== "0") {
            setIsUpdate(true);
        }
    }, [data])

    return (

        <Dialog open={isOpen} onOpenChange={handleOnchage}>
            <form>
                <DialogTrigger render={<Button variant="outline" onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}>{isUpdate ?
                    <span className="grid grid-cols-1"><MdModeEdit color="#D97706" /></span> :
                    <span className="grid grid-cols-2 gap-1 items-center"><MdAddCircleOutline color="green" /> Add</span>}
                </Button>}>
                </DialogTrigger>
                <DialogContent className="sm:max-w-175">
                    <DialogHeader>
                        <DialogTitle>{isUpdate ? "Update" : "Add"}</DialogTitle>
                    </DialogHeader>
                    <ProductAddEditForm data={{
                        id: id, category_id: category_id, product_name: product_name,
                        product_description: product_description, image_path: image_path,
                        sale_rate: sale_rate, created_at: created_at
                    }} setIsOpen={setIsOpen} />
                </DialogContent>

            </form>
        </Dialog>
    )
}



