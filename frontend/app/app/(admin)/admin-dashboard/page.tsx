'use client'
import { getUser, getUsers, loggedIn } from '@/app/services/auth'
import { getCategories } from '@/app/services/category'
import { getOrders } from '@/app/services/order'
import { getOrderItems } from '@/app/services/order-items'
import { getProducts } from '@/app/services/product'
import ChartAreaInteractive from '@/components/app-area-chart'
import OrderView from '@/components/order/order-overview'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type typeData= {
        user: any,
        order: any,
        orderItems: any,
}


const Dashboard = () => {
  const pathname = usePathname()
  const [data, setData] = useState<typeData>()
  const [user, setUser] = useState([])
  const [order, setOrder] = useState([])
  const [category, setCategory] = useState([])
  const [product, setProduct] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [loggedin, setLoggedin] = useState("")

  useEffect(() => {
    const getData = async () => {

      const status = await loggedIn();
      setLoggedin(status)

      // category data
      const category = await getCategories();
      setCategory(category)
      // product data
      const product = await getProducts();
      setProduct(product)
      // user data
      const user = await getUsers();
      setUser(user)
      // order data
      const order = await getOrders();
      setOrder(order)
      // oder items
      const items = await getOrderItems();

      let orderItemsTitle = [];
      for (let i = 0; i < items.length; i++) {
        const element = items[i];
        const filterProduct = product.filter((p: any) => p.id == element.product_id)
        const product_name = filterProduct[0].product_name
        const item = {
          order_id: element.order_id,
          product_id: element.product_id,
          product_name: product_name,
          purchase_price: element.purchase_price,
          quantity: element.quantity,
          updated_at: element.updated_at,
          created_at: element.created_at
        }
        orderItemsTitle.push(item)
      }

      const tempData = {
        user: user,
        order: order,
        orderItems: orderItemsTitle
      }
      setData(tempData)
    }
    getData()

  }, [pathname])



  return (
    <>
      {loggedin == "loggedout" && redirect("admin-login")}
      <h2 className='text-semibold text-xl px-1 mb-5'>Dashboard</h2>
      <div className='grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-2'>
        <div className='border-2 bg-pink-600 py-10 rounded-2xl px- text-white shadow-2xl px-2'>
          <div className='flex flex-col items-center justify-center'>
            {user && user.length == 0 ? <span>loading...</span> : <> <h3 className='text-lg font-semibold'>User</h3>
              <span className='text-md font-bold'>{user.length}</span></>}
          </div>
        </div>
        <Link className='border-2 bg-amber-700 py-10 rounded-2xl px- text-white shadow-2xl px-2'  href={"/category"}>
          <div className='flex flex-col items-center justify-center'>
            {category && category.length == 0 ? <span>loading...</span> : <> <h3 className='text-lg font-semibold'>Category</h3>
              <span className='text-md font-bold'>{category.length}</span></>}

          </div>
        </Link>
        <Link className='border-2 bg-violet-900 py-10 rounded-2xl px- text-white shadow-2xl px-2' href={"/product"}>
          <div className='flex flex-col items-center justify-center'>
            {product && product.length == 0 ? <span>loading...</span> : <><h3 className='text-lg font-semibold'>
              Product
            </h3>
              <span className='text-md font-bold'>{product.length}</span></>}
          </div>
        </Link>
        <Link className='border-2 bg-blue-500 py-10 rounded-2xl px- text-white shadow-2xl px-2' href={"/customer-order"}>
          <div className='flex flex-col items-center justify-center'>
            {order && order.length == 0 ? <span>loading...</span> : <> <h3 className='text-lg font-semibold'>Order</h3>
              <span className='text-md font-bold'>{order.length}</span></>}

          </div>
        </Link>
      </div>
     
      {order && order.length > 0 &&
        <>
          <ChartAreaInteractive data={order} />
          <br />
          {data!=undefined && <OrderView passingData={data} />}
        </>
      }
    </>
  )
}

export default Dashboard
