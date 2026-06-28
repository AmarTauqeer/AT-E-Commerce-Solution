'use client'
import { Button } from "@/components/ui/button"
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
// import AddEditForm from "./AddEditForm"
import { Loader2Icon } from "lucide-react"
import PermissionsAddEditForm from "./permission-add-update-form";

export type receiveDataType = {
    data: {
        id: string | undefined,
        user: string | undefined,
        resource: string | undefined,
        Read: boolean | undefined,
        Write: boolean | undefined,
        Update: boolean | undefined,
        Delete: boolean | undefined,
        created_at: Date | undefined,
    }
}

export function PermissionsAddOrUpdateDialog({ data }: receiveDataType) {
    const router = useRouter()
    let { id, resource, user, Read, Write, Update, Delete } = data;

    const [isOpen, setIsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [resourceInput, setResourceInput] = useState<string | undefined>("");
    const [userInput, setUserInput] = useState<string | undefined>("");
    const [readInput, setReadInput] = useState<boolean | undefined>(false);
    const [writeInput, setWriteInput] = useState<boolean | undefined>(false);
    const [updateInput, setUpdateInput] = useState<boolean | undefined>(false);
    const [deleteInput, setDeleteInput] = useState<boolean | undefined>(false);

    const [loading, setLoading] = useState(false);

    const handleOnchage = () => {
        setIsOpen(!isOpen);
    }

    const handleAdd = async (id: string | undefined) => {

        const URL = "/api/permissionsaddorupdate/";

        const response = await fetch(URL, {
            method: "POST", body: JSON.stringify({
                id, resource, user, Write, Read, Update, Delete
            })
        });
        if (response) {
            redirect("/permissions")
        } else {

            return false;
        }
    }
    const onChange = (e: FormEvent<HTMLInputElement>) => {
        setUserInput(e.currentTarget.value);
        setResourceInput(e.currentTarget.value);
    };

    useEffect(() => {
        if (id !== "0") {
            setIsUpdate(true);
        }
    }, [data])

    return (

        <Dialog open={isOpen} onOpenChange={handleOnchage}>
            <form>
                <DialogTrigger render={<Button variant="outline" className="hover:cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}>{isUpdate ?
                        <span className="grid grid-cols-1"><MdModeEdit color="#D97706"  /></span> :
                        <span className="grid grid-cols-2 gap-1 items-center"><MdAddCircleOutline color="green" /> Add</span>}
                    </Button>}>
                    
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>{isUpdate ? "Update" : "Add"}</DialogTitle>
                    </DialogHeader>
                    <PermissionsAddEditForm data={{
                        id: id, resource: resource, user: user,
                        Write: Write, Read: Read, Update: Update, Delete: Delete
                    }} setIsOpen={setIsOpen} />
                </DialogContent>

            </form>
        </Dialog>
    )
}



