'use client'
import { Button } from "@/components/ui/button"
import { BiSolidEdit } from "react-icons/bi";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { redirect, useRouter } from "next/navigation"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import OrderAddEditForm from "./order-add-update-form";

export type receiveDataType = {
    data: {
        id?: string | undefined
        user_id: string | undefined,
        email: string | undefined,
        order_amount: number | undefined,
        order_status: string | undefined
        created_at?:Date,
        users:[{}],
        products:[{}],
        orderItems:[{}],
    }
}

export function OrderAddOrUpdateDialog({ data }: receiveDataType) {
    const router = useRouter()
    let { id, user_id, email, order_status, order_amount, created_at, users, products, orderItems } = data;

    const [isOpen, setIsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const handleOnchage = () => {
        setIsOpen(!isOpen);
    }
    useEffect(() => {
        if (id !== "0") {
            setIsUpdate(true);
        }
    }, [data])

    return (

        <Dialog open={isOpen} onOpenChange={handleOnchage}>
            <form>
                <DialogTrigger render={ <Button variant="outline"  onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}>{isUpdate ?
                        <span className="grid grid-cols-1"><MdModeEdit color="#D97706" /></span> :
                        <span className="grid grid-cols-2 gap-1 items-center"><MdAddCircleOutline color="green" /> Add</span>}
                    </Button>}>
                   
                </DialogTrigger>
                <DialogContent className="sm:max-w-[80vw]">
                    <DialogHeader>
                        <DialogTitle>{isUpdate ? "Update" : "Add"}</DialogTitle>
                    </DialogHeader>
                    <OrderAddEditForm data={{ id: id, user: user_id, email:email, order_status:order_status,
                        order_amount:order_amount,created_at:created_at, users:users, products:products, orderItems:orderItems }} setIsOpen={setIsOpen} />
                </DialogContent>

            </form>
        </Dialog>
    )
}



