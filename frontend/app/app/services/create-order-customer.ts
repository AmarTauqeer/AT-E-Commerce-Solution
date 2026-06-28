import { api } from "../lib/axios";
import { getUser, getUsers } from "./auth";

export async function createOrder(data: any) {

    let orderId: number;
    let totalAmount = 0;

    if (data.length > 0) {
        data.forEach((element: any) => {
            totalAmount += element.quantity * element.price
        });
    }

    const currentUser = await getUser()
    const email = await currentUser.sub
    const users = await getUsers()
    const filterUsers = users.filter((u:any)=>u.email==email)
    const userId = filterUsers[0].id

    // order

    const orderData = {
        user_id: userId,
        order_amount: totalAmount,
        order_status: "Created"
    }
    const postOrder = async () => {
        const response = await api.post("/order/", orderData);
        return await response.data[0]
    }

    const response:{id:number} = await postOrder()
    orderId = response.id

    if (orderId > 0) {
        // orderline
        data.forEach((element: any) => {
            const orderItem = {
                order_id: orderId,
                product_id: element.id,
                purchase_price: element.price,
                quantity: element.quantity,
            }

            const createOrderItems = async () => {
                const response = await api.post("/orderItems/", orderItem);
                console.log(await response.data[0])
            }
            createOrderItems()
        });
    }

    return true
}