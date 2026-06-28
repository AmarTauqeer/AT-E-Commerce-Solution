"use client";

import { getUser } from "@/app/services/auth";
import { getCategories } from "@/app/services/category";
import { getOrders } from "@/app/services/order";
import { getOrderItems } from "@/app/services/order-items";
import { getProducts } from "@/app/services/product";
import { OrderReport } from "@/components/order/order-report.component";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderReportViewer() {
    const [orderItems, setOrderItems] = useState([])
    const [orders, setOrders] = useState()
    const searchParams = useSearchParams()

    let orderId = searchParams.get('id')


    useEffect(() => {
        const getData = async () => {
            const responseOrder = await getOrders()
            const filterOrder = responseOrder.filter((o: any) => o.id == orderId)
            const currUser = await getUser()
            const email = currUser.sub
            const orderData:any ={
                id:filterOrder[0].id,
                order_status :filterOrder[0].order_status,
                email:email
            }
            setOrders(orderData)

            const responseCategories = await getCategories()
            const responseProducts = await getProducts()
            const resposneOrderItems = await getOrderItems()
            const filterOrderItems = resposneOrderItems.filter((oi: any) => oi.order_id == orderId)
            let array: any = [];
            filterOrderItems.forEach((litem: any) => {
                let categoryName = ""
                let productName = ""
                const filterProducts = responseProducts.filter((pr: any) => pr.id == litem.product_id)
                productName = filterProducts[0].product_name
                const categoryId = filterProducts[0].category_id
                const filterCategories = responseCategories.filter((c: any) => c.id == categoryId)
                categoryName = filterCategories[0].category_name
                console.log("purchase price = "+litem.purchase_price)
                console.log("quantity = "+litem.quantity)
                const newData = {
                    id: litem.id,
                    orderId: litem.id,
                    product_name: productName,
                    price: litem.purchase_price,
                    category_name: categoryName,
                    created_at: litem.created_at,
                    quantity: litem.quantity,
                    amount_per_product: parseInt(litem.quantity) * parseInt(litem.purchase_price)
                }
                if (newData) {
                    array.push(newData)
                }
            });
            if (array.length > 0) setOrderItems(array);
        }
        getData()
    }, [])

    return (
        <>
            {orderItems !== undefined && orders !== undefined && <PDFViewer
                style={{
                    width: "100%",
                    height: "100vh",
                }}
            >

                <OrderReport
                    products={orderItems} order={orders}
                />
            </PDFViewer>}

        </>
    );
}