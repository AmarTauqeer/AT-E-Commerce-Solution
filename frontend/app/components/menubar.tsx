import * as React from "react"
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getUser } from "@/app/services/auth";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";


export function MenuBar() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const pathname = usePathname()
    console.log(pathname)

    React.useEffect(() => {
        const checkAuthentication = async () => {
            const response = await getUser()
            if (response.sub !== undefined) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        }
        checkAuthentication()
    }, [pathname])

    return (
        <motion.div initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            // className="hidden md:inline-flex justify-center w-1/3 py-1 mt-5 gap-4 text-sm capitalize font-semibold"
            className={cn(
                "hidden md:flex items-center gap-2 rounded-full p-2 mt-5",
                "border border-border/50",
                "bg-muted/50",
                "backdrop-blur-md"
            )}
        >

            <NavigationMenu>
                <NavigationMenuList>
                    {isAuthenticated ?
                        <NavigationMenuItem >
                            <Link
                                href="/shop"
                                className={cn(
                                    "relative rounded-full px-5 py-2",
                                    "text-sm font-medium",
                                    "transition-colors duration-200",
                                    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    pathname == "/shop"
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {pathname == "/shop" && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className={cn(
                                            "absolute inset-0 -z-10",
                                            "rounded-full",
                                            "bg-primary",
                                            "shadow-sm"

                                        )}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">
                                    Shop
                                </span>
                            </Link>

                        </NavigationMenuItem> : ""}

                    <NavigationMenuItem>
                        <Link
                            href="/about"
                            className={cn(
                                "relative rounded-full px-5 py-2",
                                "text-sm font-medium",
                                "transition-colors duration-200",
                                "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                pathname == "/about"
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {pathname == "/about" && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className={cn(
                                        "absolute inset-0 -z-10",
                                        "rounded-full",

                                        "bg-primary",
                                        "shadow-sm"

                                    )}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">
                                About Us
                            </span>
                        </Link>


                    </NavigationMenuItem>

                    <NavigationMenuItem>
                                                    <Link
                                href="/contact"
                                className={cn(
                                    "relative rounded-full px-5 py-2",
                                    "text-sm font-medium",
                                    "transition-colors duration-200",
                                    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    pathname == "/contact"
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {pathname == "/contact" && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className={cn(
                                            "absolute inset-0 -z-10",
                                            "rounded-full",
                                            "bg-primary",
                                            "shadow-sm"

                                        )}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">
                                    Contact Us
                                </span>
                            </Link>
                        {/* <Link
                            href="/contact"
                            className={cn(
                                "rounded-2xl px-4 py-2 text-sm font-medium transition-colors hover:translate-x-1",
                                pathname === "/contact"
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            Contact Us
                        </Link> */}
                    </NavigationMenuItem>
                </NavigationMenuList>

            </NavigationMenu>
        </motion.div>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink render={<Link href={href}>
                <div className="flex flex-col gap-1 text-sm">
                    <div className="leading-none font-medium">{title}</div>
                    <div className="text-muted-foreground line-clamp-2">{children}</div>
                </div>
            </Link>}>
            </NavigationMenuLink>
        </li>
    )
}
