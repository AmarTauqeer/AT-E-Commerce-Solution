import { Suspense } from "react";
import { CustomerOrderDataTable } from "@/components/order/customer-order-data-table";
import { getOrders } from "@/app/services/order";
import { getUsers } from "@/app/services/auth";
import { getProducts } from "@/app/services/product";
import { getOrderItems } from "@/app/services/order-items";

const CustomerOrder = async () => {

  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">Customer Order</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
  
    const responseOrder = await getOrders();
    const users = await getUsers()
    const products = await getProducts()
    const lineItems = await getOrderItems()
    let orderItems:any=[]
    lineItems.forEach((element:any) => {
      const data={
        order_id: element.order_id,
        id:element.id,
        product_id:element.product_id.toString(),
        quantity:element.quantity.toString(),
        purchase_price: element.purchase_price.toString(),
        amount_per_product :parseInt(element.quantity)*parseInt(element.purchase_price)
      }
      orderItems.push(data)
    });
    let response = [];
    if (responseOrder.length > 0 && users.length > 0) {
      for (let i = 0; i < responseOrder.length; i++) {
        const element = responseOrder[i];
        const filterUser = users.filter((u: any) => u.id == element.user_id)
        const email = filterUser[0].email;
        const newOrder = {
          id: element.id,
          user_id: element.user_id,
          email: email,
          order_status: element.order_status,
          order_amount: element.order_amount,
          created_at: element.created_at,
          updated_at: element.updated_at,
        }
        response.push(newOrder)
      }
    }
    const data = {
      response: response,
      users: users,
      products:products,
      orderItems:orderItems
    }
    return <CustomerOrderDataTable response={data} />
}

export default CustomerOrder;
