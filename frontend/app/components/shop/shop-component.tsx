'use client'
import React, { FC, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Euro, Search, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { redirect, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/app/store/cart'
import { RootState, store } from '@/app/store'
import { getProducts } from '@/app/services/product'
import { getCategories } from '@/app/services/category'
import { motion } from 'motion/react'
import { ShopCarousel } from './shop-carousel'
import { ButtonGroup } from '../ui/button-group'
import { InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Tooltip, TooltipContent } from '../ui/tooltip'


interface Product {
    category_id: number,
    product_name: string,
    image_path?: string,
    sale_price?: number,
    purchase_price?: number,
    created_at?: Date,
    updated_at?: Date
    id?: number
}

interface Category {
    id: number,
    category_name: string,
    created_at?: Date,
    updated_at?: Date
}


function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const ShopComponent: FC = () => {

    const router = useRouter()
    const carts = useSelector((state: RootState) => state.cart)
    // console.log(carts)
    const dispatch = useDispatch()

    const [productPerPage, setProductPerPage] = useState("4")
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])

    interface IData {
        categories: any[];
        products: any[];
    }
    const [data, setData] = React.useState<IData>({
        categories: [],
        products: [],
    });


    const totalProducts = products.length


    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    let pages = []
    for (let i = 1; i <= Math.ceil(totalProducts / parseInt(productPerPage)); i++) {
        pages.push(i)
    }
    const lastProductIndex = currentPage * parseInt(productPerPage);
    const firstProductIndex = lastProductIndex - parseInt(productPerPage);

    let currentProducts;

    if (search !== "") {
        const product = products.filter((c: any) => c.product_name.toLowerCase().includes(search.toLowerCase()))
        if (product) {
            currentProducts = product
        }
    } else {
        currentProducts = products.slice(firstProductIndex, lastProductIndex)
    }

    if (category != undefined && category !== "all") {
        const product = products.filter((c: any) => c.category_id == parseInt(category))
        if (product) {
            currentProducts = product
            const newProductLength = currentProducts.length
            pages = []
            for (let i = 1; i <= Math.ceil(newProductLength / parseInt(productPerPage)); i++) {
                pages.push(i)
            }
        }
    }

    const categoryName = (id: any) => {
        const category = categories.filter((c: any) => c.id == id)
        if (category) {
            return category[0].category_name
        }
    }

    function handleClick(product: any) {

        const productData = {
            id: product.id,
            quantity: 1,
            price: product.sale_price,
            total_price: 1 * product.sale_price,
            product_name: product.product_name,
            image_path: product.image_path,
        }
        dispatch(addToCart(productData))

    }

    useEffect(() => {

        const getData = async () => {
            async function getProductsData() {
                return await getProducts()
            }
            async function getCategoriesData() {
                return await getCategories()
            }
            const categoryData = getCategoriesData()
            const productData = getProductsData()
            const [categoriesResponse, productsResponse] = await Promise.all([categoryData, productData])

            if (productsResponse.detail == 'Not authenticated') {
                redirect("/user-login")
            }
            if (categoriesResponse) {
                setCategories(categoriesResponse)
            }
            if (productsResponse) {
                setProducts(productsResponse)
            }

            if (categoriesResponse != undefined && productsResponse != undefined) {
                const newData = {
                    categories: categoriesResponse,
                    products: productsResponse,
                }
                setData(newData)
            }
        }
        getData()


    }, [dispatch, search])

    return (
        <>
            {data.categories.length > 0 && data.products.length > 0 && <ShopCarousel data={data} />}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className='ml-2 mr-2 mt-4 gap-2 flex flex-col md:flex-row lg:flex-row xl:flex-row justify-between'>
                
                <div className="relative w-full max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground "
                    />
                    <Input
                        className='pl-8 text-md'
                        placeholder='Search product'
                        name='search'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                </div>
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className='flex flex-row items-center gap-2'>
                    <label>Category</label>
                    <Select
                        name='category'
                        value={category}
                        onValueChange={(value) => {
                            setCategory(value)
                        }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select a Category</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                {categories.length > 0 && categories.map((c, index) => (
                                    <SelectItem key={index} value={c.id.toString()}>
                                        {c.category_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <label>Products Per Page</label>
                    <Select
                        name='productPerPage'
                        value={productPerPage}
                        onValueChange={(v) => setProductPerPage(v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Products per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Products Per Page</SelectLabel>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="16">16</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xxl:grid-cols-5 gap-5 px-2 pt-8">
                {currentProducts && currentProducts.map((i: any) => (
                    <Card key={i.id} className='overflow-hidden rounded-lg shadow-lg p-0'>
                        <CardHeader className='p-0 relative'>
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                                whileHover={{ scale: 1.1 }}
                                className='relative h-94 w-full overflow-hidden rounded-lg border'>
                                <Link className='px-2 text-md font-bold' href={{
                                    pathname: "/shop/shop-detail",
                                    query: {
                                        id: i.id,
                                        product_name: i.product_name,
                                        product_description: i.product_description,
                                        sale_price: i.sale_price,
                                        image_path: i.image_path,
                                        category_name: categoryName(i.category_id)
                                    }
                                }}><Image
                                        src={i.image_path}
                                        alt={i.product_name}
                                        fill
                                        className="object-cover transition-transform duration-500 ease-in-out hover:scale-125"
                                        unoptimized
                                    /></Link>


                                <Badge className='absolute top-2 left-2'>
                                    <h4 className='text-md font-semibold'>{categoryName(i.category_id)}</h4>
                                </Badge>
                            </motion.div>

                            <CardContent className='p-1'>
                                <motion.h3 initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.1 }} className='text-xl font-semibold mb-4 min-h-14'>{i.product_name}</motion.h3>
                                <motion.div initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.1 }} className='text-lg font-semibold mb-3 flex flex-row items-center'>
                                    <Euro />{i.sale_price.toFixed(2)}
                                </motion.div>
                                <motion.div initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.1 }} className='text-sm text-gray-400 mb-4 min-h-10'>
                                    {i.product_description.slice(0, 60)}<Link className='px-2 text-md font-bold' href={{
                                        pathname: "/shop/shop-detail",
                                        query: {
                                            id: i.id,
                                            product_name: i.product_name,
                                            product_description: i.product_description,
                                            sale_price: i.sale_price,
                                            image_path: i.image_path,
                                            category_name: categoryName(i.category_id)
                                        }
                                    }}>... More Detail</Link>
                                </motion.div>

                                <div className='flex items-center justify-between mb-1'>
                                    <Button
                                        className='w-full py-2'
                                        onClick={() => handleClick(i)}
                                    >
                                        <ShoppingCart size={4} />
                                        Add to Cart
                                    </Button>
                                </div>
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </motion.div>
            <div className='mt-2 flex items-center justify-center'>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => {
                                    // console.log(currentPage + 'previous')
                                    if (currentPage > 1) {
                                        setCurrentPage(currentPage - 1)
                                    }
                                }}
                            >
                            </PaginationPrevious>
                        </PaginationItem>
                        {
                            pages.map((page, idx) => (
                                <PaginationItem key={idx} className={currentPage === page ? 'rounded-md' : ""}>
                                    <PaginationLink onClick={() => setCurrentPage(page)}>
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                        }
                        <PaginationItem>
                            <PaginationNext
                                onClick={
                                    () => {
                                        // console.log(currentPage + 'next')
                                        if (currentPage < pages.length) {
                                            setCurrentPage(currentPage + 1)
                                        }
                                    }}
                            >
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    )
}

export default ShopComponent
