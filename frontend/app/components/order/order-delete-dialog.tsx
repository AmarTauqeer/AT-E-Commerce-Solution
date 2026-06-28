'use client'
import { Button } from "@/components/ui/button"
import { MdDeleteOutline } from "react-icons/md";
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

import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteOrder } from "@/app/services/order";

export type typeId = {
  id: string
}

export function DeleteOrderDialog(id: typeId) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleOnchage = () => {
    setIsOpen(!isOpen);
  }

  const handleDelete = async (id: typeId) => {
    setLoading(true);

    const response = await deleteOrder({ 'id': id })
    console.log(response)

    if (response=="deleted") {
        setLoading(false)
        router.push("/customer-order")
    } else {
      setLoading(false)
      return false;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnchage}>
      <form>
        <DialogTrigger render={ <Button variant="destructive" size="sm"
            onClick={(e) => { e.stopPropagation(); setIsOpen(true) }}>
            <span className="grid grid-cols-1"><MdDeleteOutline />
            </span>
          </Button>}>
         
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>
              Are you sure to delete this record?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button className="grid-cols-2" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>

            <Button variant="destructive" type="button" onClick={(e) => { e.stopPropagation(); handleDelete(id); }} disabled={loading}>
              {loading && <><Loader2Icon className="animate-spin" /> Please wait</>}
              {!loading && <p>Delete</p>}
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
