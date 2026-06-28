'use client'

import { addToCart } from "@/app/store/cart"
import { Button } from "@/components/ui/button"
import { Euro } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from 'next/navigation'
import { useState } from "react"
import { useDispatch } from "react-redux"

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

    return (
        <>
            <div>
                <h3 className="px-2 text-2xl font-bold mb-2 mt-2">Product Detail</h3>
            </div>
            <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <div className="p-5">
                    <h2 className="text-2xl font-bold mb-2">{category_name}</h2>
                    <h3 className='text-xl font-semibold'>{product_name}</h3>
                    <div className='text-sm text-gray-500 mb-2'>
                        {product_description}
                    </div>
                    <div className='text-lg font-bold mb-3 flex flex-row items-center'>
                        <Euro />{sale_price}
                    </div>
                    <Button
                        className='w-[30%] py-1'
                        onClick={() => handleClick()}
                    >
                        Add to Cart
                    </Button>
                </div>
                <div className='relative h-48 md:h-96 lg:h-96'>
                    <img
                        src={image_path || ""}
                        alt={product_name || ""}
                        className='w-full h-full object-fit'
                    />
                    {/* <Image
            src={image_path || ""}
            alt={product_name || ""}
            layout='fill'
            objectFit='cover'
            className={cn('rounded-lg border-2 transform transition-all group-hover:opacity-75 group-hover:scale-105 duration-700 ease-in-out',
              isLoading
                ? 'grayscale blur-2xl scale-110'
                : 'grayscale-0 blur-0 scale-100'
            )}
            onLoadingComplete={() => setIsLoading(false)}
          /> */}
                </div>

            </div>
        </>
    )
}

export default ProductDetail
