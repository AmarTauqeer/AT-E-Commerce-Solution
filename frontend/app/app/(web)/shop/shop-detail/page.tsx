'use client'
import { loggedIn } from "@/app/services/auth"
import { addToCart } from "@/app/store/cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Euro } from "lucide-react"
import Image from "next/image"
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

// import ReactImageMagnify from 'react-image-magnify';

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const ProductDetail = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)

    const searchParams = useSearchParams()
    let id = 0, product_name = "", product_description = "",
        sale_price = 0, image_path = "", category_name = "";

    if (searchParams) {
        id = parseInt(searchParams.get("id") || "")
        product_name = searchParams.get("product_name") || ""
        product_description = searchParams.get("product_description") || ""
        sale_price = parseInt(searchParams.get("sale_price") || "")
        product_name = searchParams.get("product_name") || ""
        image_path = searchParams.get("image_path") || ""
        category_name = searchParams.get("category_name") || ""
    }

    function handleClick() {

        const productData = {
            id: id,
            quantity: 1,
            price: sale_price,
            total_price: 1 * sale_price,
            product_name: product_name,
            image_path: image_path,
        }
        dispatch(addToCart(productData))
        const localData = localStorage.getItem('products')
        if (localData) {
            const jsonArray = JSON.parse(localData)
            jsonArray.push(productData)
            localStorage.setItem('products', JSON.stringify(jsonArray)
            )
        } else {
            localStorage.setItem('products', JSON.stringify([productData]))
        }
    }

    useEffect(() => {
        const currentUser = async () => {
            const loginStatus = await loggedIn()
            if (loginStatus == "loggedout") {
                redirect("/user-login")
            }
        }
        currentUser()

    }, [useDispatch, searchParams])


    return (
        <>
            <div>
                <h3 className="px-2 text-2xl font-bold mb-2 mt-2">Product Detail</h3>
            </div>
            <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <div className="p-5">
                    <h2 className="text-2xl font-bold mb-2">{category_name}</h2>
                    <h3 className='text-xl font-semibold'>{product_name}</h3>
                    <div className='text-sm text-gray-500 mb-2 text-justify'>
                        {product_description}
                    </div>
                    <div className='text-lg font-bold mb-3 flex flex-row items-center'>
                        <Euro />{sale_price.toFixed(2)}
                    </div>
                    <Button
                        className='w-[30%] py-1'
                        onClick={() => handleClick()}
                    >
                        Add to Cart
                    </Button>
                </div>

                <div className="relative h-full w-full overflow-hidden rounded-lg border">
                    <Image
                        src={image_path || ""}
                        alt={product_name || ""}
                        width={700}
                        height={400}
                        className="object-cover transition-transform duration-500 ease-in-out hover:scale-125"
                        unoptimized
                    />
                </div>
            </div>

        </>
    )
}

export default ProductDetail
