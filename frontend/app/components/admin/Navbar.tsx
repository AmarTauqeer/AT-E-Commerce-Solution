'use client'
import { LogOut, Moon, Settings, Sun, User, UserRoundCog } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { api } from '@/app/lib/axios'
import { getUser } from '@/app/services/auth'
// import { useAuth } from './AuthProvider'

const Navbar = () => {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()
  const [isOpen, setIsOpen] = useState(false);
  const[currUser, setCurrUser]=useState("")


  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await getUser()
      if (response.sub!==undefined) {
        setCurrUser(response.sub)
        setIsAuthenticated(true)
      }else{
        setIsAuthenticated(false)
      }
    }
    checkAuthentication()
  }, [pathname])

  return (
    <>
      {pathname == "/admin-login" ? "" : <nav className='flex items-center justify-between p-4'>
        <SidebarTrigger />
        <div className='flex items-center gap-4'>
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



          {/* user-menu */}
          {isAuthenticated && <> <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/31622472?s=400&u=bbd31c3892e24f0b6af34089930b5ff1c73d05fd&v=4" width={20} height={20} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{currUser}</DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <User className='h-[1.2rem] w-[1.2rem] mr-2' />
                <Link href="/user">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <Settings className='h-[1.2rem] w-[1.2rem] mr-2' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem variant='destructive' onClick={() => setIsOpen(false)}>
                <LogOut className='h-[1.2rem] w-[1.2rem] mr-2' />
                <Link href="/admin-logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu></>}

        </div>
      </nav>}

    </>
  )
}

export default Navbar
