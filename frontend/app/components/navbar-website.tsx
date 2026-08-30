'use client'
import { LogOut, Moon, Settings, Sun, User, UserRoundCog } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import SearchBar from '@/app/(web)/searchbar.tsx/page'
import CartIcon from '@/app/(web)/cart-icon/page'
import FavoriteIcon from '@/app/(web)/favorite-icon/page'
import { getUser } from '@/app/services/auth'
import { motion } from 'motion/react'


const NavbarWebsite = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currUser, setCurrUser] = useState("")

  const [isScrolled, setIsScrolled] = React.useState(false);

  function handleClick() {
    router.push('/shoping-cart')
  }

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const checkAuthentication = async () => {
      const response = await getUser()
      if (response.sub !== undefined) {
        setCurrUser(response.sub)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
    checkAuthentication()

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <motion.div initial={{ x: -30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }} className='flex items-center gap-3 mt-4'>

        {isAuthenticated && <>
          <SearchBar />
          <span onClick={handleClick}><CartIcon /></span>
          <FavoriteIcon />
        </>}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>}>

          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isAuthenticated ? <>
          <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/31622472?s=400&u=bbd31c3892e24f0b6af34089930b5ff1c73d05fd&v=4"
                  width={20} height={20}
                />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} onClick={() => setIsOpen(!isOpen)}>
              <span className='text-xs'>{currUser}</span>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsOpen(!isOpen)}>
                <User className='h-[1.2rem] w-[1.2rem] mr-2' />
                <Link href="/user-profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpen(!isOpen)}>
                <Settings className='h-[1.2rem] w-[1.2rem] mr-2' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem variant='destructive' onClick={() => setIsOpen(!isOpen)}>
                <LogOut className='h-[1.2rem] w-[1.2rem] mr-2' />
                <Link href="/user-logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu></> : <Button className='text-sm font-semibold hover:text-secondary hover:cursor-pointer'>
          <Link href="/user-login">Login</Link>
        </Button>}

      </motion.div>
    </>
  )
}

export default NavbarWebsite
