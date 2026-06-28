'use client'

import React from "react";
import { Separator } from "./ui/separator";
import { usePathname } from 'next/navigation'
import Logo from "./logo";
import MobileMenu from "@/app/(web)/mobile-menu/page";
import NavbarWebsite from "./navbar-website";
import { MenuBar } from "./menubar";

const MainHeader = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname()

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
        <nav className={`fixed w-full transition-colors duration-300 z-50 ${isScrolled ? "backdrop-blur-md shadow-sm" : "bg-transparent"
            }`}>
            <div className="flex justify-center items-center w-full bg-card">
                <div className="flex items-center justify-between md:w-2/3">
                    <div className="w-auto md:w-1/3 flex items-center gap-2 justify-start">
                        <MobileMenu />
                        <Logo />
                    </div>
                    {pathname!=="/user-logout" && <MenuBar />}
                    <NavbarWebsite />

                </div>
            </div>
            <Separator className="border border-acent" />
        </nav>
        </>
    )
}

export default MainHeader
