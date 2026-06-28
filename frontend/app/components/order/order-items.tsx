'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

const OrderItems = (props: any) => {
    const { items, orderId } = props
    const filterItems = items.filter((itm: any) => itm.order_id == orderId)

    return (
        <>
            <Accordion>
                <AccordionItem value="items">

                    <AccordionTrigger>
                        Items
                    </AccordionTrigger>

                    <AccordionContent>

                        <div className="space-y-1">
                             <div className="flex border-b font-semibold">
                                <div className="w-20 shrink-0 p-2">ID</div>
                                <div className="w-lg shrink-0 p-2">Name</div>
                                <div className="w-20 shrink-0 p-2">Quantity</div>
                                <div className="w-20 shrink-0 p-2">Price</div>
                                <div className="w-30 shrink-0 p-2">Amount</div>
                                </div>

                            {filterItems.map((item: any) => (
                                    <div className="flex border-b" key={item.product_id}>
                                        <div className="w-20 shrink-0 p-2">{item.product_id}</div>
                                        <div className="w-lg shrink-0 p-2">{item.product_name}</div>
                                        <div className="w-20 shrink-0 p-2 text-center">{item.quantity}</div>
                                        <div className="w-20 shrink-0 p-2 text-end">{item.purchase_price.toFixed(2)}</div>
                                        <div className="w-30 shrink-0 p-2 text-end">{(item.quantity * item.purchase_price).toFixed(2)}</div>
                                    </div>
                            ))}

                        </div>

                    </AccordionContent>

                </AccordionItem>

            </Accordion>
        </>
    )
}

export default OrderItems
