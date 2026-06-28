'use client'

import { ChevronDown, ChevronUp, Euro, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import OrderItems from "./order-items";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface IData {
    passingData: {
        user: any,
        order: any,
        orderItems: any,
    }
}

const OrderView = ({ passingData }: IData) => {
    const user = passingData.user
    const order = passingData.order
    const items = passingData.orderItems

    const [orderItems, setOrderItems] = useState([])
    const [expandedId, setExpandedId] = useState()
    const [active, setActive] = useState(false)


    const userName = (id: number) => {
        if (user.length > 0) {
            const filterUser = user.filter((u: any) => u.id == id)
            if (filterUser) {
                let email = filterUser[0].email;
                return email
            }
        }
    }
    const filterItems = (id: number) => {
        if (items.length > 0) {
            const filteredItems = items.filter((item: any) => item.order_id == id)
            setOrderItems(filteredItems)
        }
    }

    return (
        <>
            <h2 className="font-bold xs:text-center">Recent Orders</h2>
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    <div className="flex border-b font-semibold gap-2">
                    <div className="w-lg shrink-0 p-2">ID</div>
                    <div className="w-80 shrink-0 p-2">User</div>
                    <div className="w-30 shrink-0 p-2">Amount</div>
                    <div className="w-48 shrink-0 p-2">Status</div>
                    </div>
                    {order !== undefined && order.map((ord: any, index: number) => (
                        <div className="flex border-b gap-2 py-2.5" key={index}>
                            <div className="flex flex-row w-lg">
                                <div>{ord.id}</div>
                                <div><OrderItems items={items} orderId={ord.id} /></div>
                            </div>
                            <div className="w-80 shrink-0 p-2">
                                {userName(ord.user_id)}
                            </div>
                         
                            <div className="w-30 shrink-0 p-2">
                                <div className="flex flex-row gap-1 items-center justify-end">
                                    <Euro size={15} />{ord.order_amount.toFixed(2)}
                                </div>
                            </div>
                            <div className={ord.order_status == 'Created' && ord.order_status != 'Delivered' ?
                                "w-48 flex shrink-0 px-2 p-2 items-center justify-center  font-semibold text-white py-1 rounded-lg bg-yellow-500" : ord.order_status == 'Pending' ?
                                    "w-48 flex shrink-0 px-2 p-2 items-center justify-center  font-semibold text-white py-1 rounded-lg bg-orange-500" :
                                    "w-48 flex shrink-0 px-2 p-2 items-center justify-center  font-semibold text-white py-1 rounded-lg bg-green-600"}>
                                {ord.order_status}
                            </div>
                               
                        </div>
                    ))}
                    
                </div>
            </div>
        </>
    )
}

export default OrderView
