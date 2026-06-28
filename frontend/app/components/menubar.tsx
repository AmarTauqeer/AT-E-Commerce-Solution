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


export function MenuBar() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const pathname =usePathname()

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
        <div className="hidden md:inline-flex w-1/3 py-5 mt-5 gap-4 text-sm capitalize font-semibold">

            <NavigationMenu>
                <NavigationMenuList>
                    {isAuthenticated ? <NavigationMenuItem>
                        <NavigationMenuLink render={<Link href="/shop">Shop</Link> } />
                    </NavigationMenuItem> : ""}

                    <NavigationMenuItem>
                        <NavigationMenuLink render={<Link href="/about">About Us</Link>}>

                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink render={<Link href="/contact">Contact</Link>}>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>

            </NavigationMenu>
        </div>
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
