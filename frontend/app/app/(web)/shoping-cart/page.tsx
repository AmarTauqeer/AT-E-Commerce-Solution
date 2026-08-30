'use client'
import { removeFromCart, changeQuantity } from "@/app/store/cart"
import { Button } from "@/components/ui/button"
import { Euro, EuroIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useRouter } from "next/navigation"
import { motion } from "motion/react"


export interface ProductState {
    id: number,
    quantity: number,
    price: number,
    total_price: number,
    product_name: string,
    image_path: string,
}



const ShopingCart = () => {
    const router = useRouter()

    const dispatch = useDispatch()
    const [totalAmount, setTotalAmount] = useState(0)
    const [products, setProducts] = useState<ProductState[]>([])

    const cartProducts = useSelector((store: any) => store.cart);
    const handleRemove = (id: number) => {
        const data = localStorage.getItem("products")
        if (data) {
            const newData = JSON.parse(data)
            const filterData = newData.filter((product: any) => product.id != id)
            if (filterData.length >= 0) {
                localStorage.setItem("products", JSON.stringify(filterData))
            }
            dispatch(removeFromCart(id))
            setProducts(filterData)
        }
    }

    useEffect(() => {
        setProducts(cartProducts)
        let totalAmount = 0;
        cartProducts.forEach((element: any) => {
            totalAmount += element.price * element.quantity
        });
        setTotalAmount(totalAmount)
    }, [cartProducts])


    const handleMinusQuantity = (id: number, quantity: number) => {
        dispatch(changeQuantity({ id, quantity: quantity - 1 }))
    }
    const handlePlusQuantity = (id: number, quantity: number) => {
        dispatch(changeQuantity({ id, quantity: quantity + 1 }))
    }

    const handleCheckout = () => {
        const pathname = "/payment-wrapper" // "/books/12/comments"
        router.push(`${pathname}`)
    }

    return (
        <>
            <motion.div initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }} className="max-w-5xl mx-auto py-8 px-4 ">
                <h3 className="text-2xl font-bold text-center mb-8">Your Cart</h3>
                {cartProducts.length == 0 ? <div className="flex justify-center mt-10">Your cart is empty!</div> : <div className="space-y-6">
                    {products.length > 0 && products.map((product: any, index: any) => (
                        <div key={index} className="flex flex-row items-center bg-white shadow-md rounded-lg p-4">
                            <motion.div initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                                whileHover={{ scale: 1.1 }} className="shrink-0">
                                <img
                                    src={product.image_path}
                                    alt={product.product_name}
                                    height={150}
                                    width={150}
                                    className="rounded-md"
                                />
                                {/* <Image
                  src={product.image_path}
                  alt={product.product_name}
                  height={150}
                  width={150}
                  className="rounded-md"
                /> */}
                            </motion.div>
                            <div className="ml-4 grow">
                                <h5 className="text-lg font-semibold text-gray-800">{product.product_name}</h5>
                                <h5 className="text-lg font-medium text-gray-600 mt-2">
                                    <div className="flex flex-row items-center font-semibold"><Euro />{product.price * product.quantity}</div>
                                </h5>
                            </div>
                            <div className="w-48 flex justify-between items-center gap-2">
                                <button className="bg-gray-300 rounded-full w-6 h-6 text-cyan-600" onClick={() => handleMinusQuantity(product.id, product.quantity)}>-</button>
                                <span className="text-gray-700 font-bold">{product.quantity}</span>
                                <button className="bg-gray-300 rounded-full w-6 h-6 text-cyan-600" onClick={() => handlePlusQuantity(product.id, product.quantity)}>+</button>
                                <Button variant="destructive" onClick={() => handleRemove(product.id)}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    {totalAmount > 0 && <div className="flex flex-row justify-end items-center gap-10">
                        <div><Button className="text-xl font-extrabold" onClick={handleCheckout}>Pay <Euro size={20} /> {totalAmount}</Button></div>
                    </div>}
                </div>}

            </motion.div>

        </>
    )
}

export default ShopingCart
