import React, { FC, useEffect, useState } from 'react'
import { X } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from './ui/navigation-menu';
import Link from 'next/link';
import Logo from './logo';
import SocialMedia from './social-media';
import { getUser } from '@/app/services/auth';
// import { useAuth } from './AuthProvider';

interface sideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: FC<sideMenuProps> = ({ isOpen, onClose }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuthentication = async () => {
            const response = await getUser()
            if (response.sub !== undefined) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        }
        checkAuthentication()

    }, [])
    return (
        <div className=
            {
                `fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"} hoverEffect`
            }
        >
            <div className='min-w-72 max-w-96 bg-black h-screen p-6 border-r border-green-400 flex flex-col gap-6'>
                <div className='flex justify-between items-center gap-5'>
                    <Logo className='text-white' />
                    <button onClick={onClose} className='hover:text-green-500 hoveEffect'><X /></button>
                </div>
                <div className='text-white items-start'>
                    <NavigationMenu orientation='vertical'>
                        <NavigationMenuList onClick={onClose} className='flex-col items-start space-y-3.5 hover:bg-green-500 hoverEffect group'>
                            {isAuthenticated && 
                            <NavigationMenuLink render={<Link href="/shop">Shop</Link>} />
                             }

                                <NavigationMenuLink render={<Link href="/about">About Us</Link>} />

                                <NavigationMenuLink render={<Link href="/contact">Contact</Link>} />
                        </NavigationMenuList>

                    </NavigationMenu>
                </div>
                <SocialMedia />
            </div>
        </div>
    )
}

export default SideMenu
