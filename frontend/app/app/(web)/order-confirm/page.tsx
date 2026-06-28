'use client'

import { useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { resetCart } from "@/app/store/cart";
import Link from "next/link";
import { createOrder } from "../../services/create-order-customer";

const OrderConfirm = () => {
    const serachParams = useSearchParams();
    let data, jsonData: any, totalAmount = 0;
    const dispatch = useDispatch()


    useEffect(() => {
        if (serachParams !== null) {
            data = serachParams.get('data')
            // console.log(data)
            if (data !== null) {
                jsonData = JSON.parse(data)
                for (let i = 0; i < jsonData.length; i++) {
                    const element = jsonData[i];
                    const subTotal = element.quantity * element.price;
                    totalAmount += subTotal
                }
            }
            const CreateOrder = async () => {
                const response = await createOrder(jsonData)
                console.log(response)
                if (response) {
                    toast.success(<div className="text-semibold text-green-800">Payment successfull</div>)
                    dispatch(resetCart())
                } else {
                    toast.error(<div className="text-semibold text-red-800">There are issues in payment process!</div>)
                }


            }
            CreateOrder()
        }
    }, [useSearchParams])
    return (
        <div className="flex justify-center">
            <Link href={"/shop"}>Shop</Link>
        </div>
    )
}

export default OrderConfirm
