'use client'
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
export const defaultImage = "default_img.png"

import { type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "../ui/button"

export function ShopCarousel(data: any) {
    console.log(data.data.products)
    const [api, setApi] = React.useState<CarouselApi>();
    const [count, setCount] = React.useState(0);
    const [current, setCurrent] = React.useState(0);

    // Direction of animation
    const [direction, setDirection] = React.useState(1);

    // Controls whether Motion animation should run
    const [animate, setAnimate] = React.useState(false);

    // const product = data.products[current];
    // console.log(product)

    const handleNext = () => {
        setDirection(1);
        setAnimate(true);

        api?.scrollNext();

        // Allow the same animation to happen again
        setTimeout(() => {
            setAnimate(false);
        }, 800);
    };

    const handlePrevious = () => {
        setDirection(-1);
        setAnimate(true);

        api?.scrollPrev();

        setTimeout(() => {
            setAnimate(false);
        }, 800);
    };

    // Get current slide
    const handleSelect = (api: CarouselApi) => {
        if (api != undefined) {
            setCurrent(api.selectedScrollSnap());
        }

    };

    React.useEffect(() => {
        if (!api) return;

        const update = () => {
            setCurrent(api.selectedScrollSnap());
        };

        update();

        api.on("select", update);

        return () => {
            api.off("select", update);
        };
    }, [api]);

    const categoryName = (id: any) => {
        const category = data.data.categories.filter((c: any) => c.id == id)
        if (category) {
            return category[0].category_name
        }
    }

    const autoplay = React.useRef(
    Autoplay({
        delay: 3000,
        stopOnInteraction: false,
    })
);


    return (
        <div
            className="ml-2 mr-2 mt-2"
            onMouseEnter={() => autoplay.current.stop()}
            onMouseLeave={() => autoplay.current.play()}>
            <Carousel
               plugins={[autoplay.current]}
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true
                }}
                className="w-full"
            >
                <CarouselContent>
                    {data.data.products.length > 0 &&
                        data.data.products.map((product: any) => (
                            <CarouselItem key={product.id} >
                                <Card className="overflow-hidden border-0 shadow-none">
                                    <CardContent className="p-0">

                                        <div
                                            className="
                                                        grid
                                                        grid-cols-1
                                                        w-full
                                                        md:h-115
                                                        md:grid-cols-2
                                                        overflow-hidden
                                                        bg-muted
                                                    "
                                        >

                                            {/* ================= IMAGE ================= */}

                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`image-${current}`}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 1.08,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.7,
                                                        ease: "easeOut",
                                                    }}
                                                    className="
                                                                relative
                                                                md:h-125
                                                                overflow-hidden
                                                                bg-linear-to-br
                                                                from-muted
                                                                to-background
                                                            "
                                                >
                                                    <img
                                                        src={product.image_path}
                                                        alt={product.product_name}
                                                        className="
                                                                    h-full
                                                                    w-full
                                                                    object-contain
                                                                    p-6
                                                                    transition-transform
                                                                    duration-700
                                                                    hover:scale-105
                                                                "
                                                    />
                                                </motion.div>
                                            </AnimatePresence>


                                            {/* ================= TEXT ================= */}

                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={current}
                                                    initial={{
                                                        opacity: 0,
                                                        y: -30,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        delay: 0.1,
                                                        ease: "easeOut",
                                                    }}
                                                    className="
                                                                flex
                                                                
                                                                flex-col
                                                                justify-center
                                                                px-6
                                                                py-4
                                                                md:h-115
                                                                md:px-8
                                                                lg:px-12
                                                            "
                                                >

                                                    <span
                                                        className="
                                                                    mb-1
                                                                    text-xs
                                                                    font-medium
                                                                    uppercase
                                                                    tracking-wider
                                                                    text-muted-foreground
                                                                "
                                                    >
                                                        Featured Product
                                                    </span>

                                                    <h2
                                                        className="
                                                                    line-clamp-2
                                                                    text-2xl
                                                                    font-bold
                                                                    tracking-tight
                                                                    md:text-3xl
                                                                "
                                                    >
                                                        {product.product_name}
                                                    </h2>

                                                    <p
                                                        className="
                                                                    mt-2
                                                                    line-clamp-2
                                                                    text-sm
                                                                    text-muted-foreground
                                                                "
                                                    >
                                                        {product.product_description}
                                                    </p>

                                                    <p className="mt-3 text-xl font-bold">
                                                        €{product.sale_price.toFixed(2)}
                                                    </p>

                                                    <Button
                                                        className="mt-3 w-fit rounded-xl px-15"
                                                    // asChild
                                                    >
                                                        <Link
                                                            href={{
                                                                pathname: "/shop/shop-detail",
                                                                query: {
                                                                    id: product.id,
                                                                    product_name:
                                                                        product.product_name,
                                                                    product_description:
                                                                        product.product_description,
                                                                    sale_price:
                                                                        product.sale_price,
                                                                    image_path:
                                                                        product.image_path,
                                                                    category_name:
                                                                        categoryName(
                                                                            product.category_id
                                                                        ),
                                                                },
                                                            }}
                                                        >
                                                            Shop
                                                        </Link>
                                                    </Button>

                                                </motion.div>
                                            </AnimatePresence>

                                        </div>

                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                </CarouselContent>
                <CarouselPrevious
                    onClick={handlePrevious}
                    className="
                    left-4
                    h-11
                    w-11
                    bg-background/80
                    backdrop-blur
                    transition-all
                    hover:scale-110
                "
                />

                <CarouselNext
                    onClick={handleNext}
                    className="
                    right-4
                    h-11
                    w-11
                    bg-background/80
                    backdrop-blur
                    transition-all
                    hover:scale-110
                "
                />
            </Carousel>
            <span>*For the demonstration purposes, data and images downloaded from <a href="https://dummyjson.com/">dummyjson.</a></span>
        </div>
    )
}
