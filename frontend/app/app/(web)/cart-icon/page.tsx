'use client'
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector} from "react-redux"

const CartIcon = () => {
  const[total, setTotal]=useState(0)
  const cartProducts = useSelector((store: any) => store.cart);

  useEffect(()=>{
    if (cartProducts && cartProducts.length>0) {
      setTotal(cartProducts.length)   
    }else{
      setTotal(0)
    }
  },[cartProducts])
  
  return (
    <Link href={"/shoping-cart"} className="group relative">
      <ShoppingBag className="w-5 h-5 hover: text-gray-600 hoverEffect" />
      <span className="absolute -top-1 -right-1 text-white bg-green-900 h-3.5 w-3.5 text-xs rounded-full flex justify-center font-semibold">
        {total}
      </span>
    </Link>
  )
}

export default CartIcon
