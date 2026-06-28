'use client'
import {
  Calendar, ListTree, ListChecks, ChartNoAxesCombined, Home, Info, Inbox, LucideProps, List,
  ProjectorIcon, Search, Settings, TimerIcon, UserRoundCog, SeparatorHorizontal
} from 'lucide-react'
import React, { ForwardRefExoticComponent, useEffect, useState } from 'react'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar
} from "../ui/sidebar"
import Link from 'next/link'
import Image from 'next/image'
// import { useAuth } from './AuthProvider'
import { URL } from 'url'
import { usePathname } from 'next/navigation'
import { getUser } from '@/app/services/auth'
import { api } from '@/app/lib/axios'
import { Separator } from '@base-ui/react'

import { VscListFlat, VscListSelection } from "react-icons/vsc";
import { FaList } from 'react-icons/fa'

import { SiGoogleforms } from "react-icons/si";
import { getSideBarState } from '@/app/services/helper/get-sidebar-state'
import logo from "../../public/company-logo.jpg"

interface IItems {
  title: string,
  url: string,
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const items = [
  {
    title: "Home",
    url: '/',
    icon: Home
  }
]
const itemsProtected = [

  {
    title: "Dashboard",
    url: '/admin-dashboard',
    icon: ChartNoAxesCombined
  },
  {
    title: "About",
    url: '/about-us',
    icon: Info
  },
  {
    title: "Order",
    url: '/customer-order',
    icon: ListChecks
  },
  {
    title: "Category",
    url: '/category',
    icon: ListTree
  },

  {
    title: "Product",
    url: '/product',
    icon: List
  },
  {
    title: "User Permissions",
    url: '/user-permissions',
    icon: UserRoundCog
  }

]

const AppSidebar = () => {
  const pathname = usePathname()
  const [menuItem, setMenuItem] = useState<IItems[]>();

  useEffect(() => {

    const checkAuthentication = async () => {
      const response = await getUser()
      if (response.status !== 401 && response.sub !== undefined) {
        setMenuItem(itemsProtected);
      } else {
        setMenuItem(items);
      }
    }
    checkAuthentication()

  }, [pathname])


  return (
    <>
      {pathname == "/admin-login" ? "" :
        <>
          <Sidebar collapsible='icon'>
            <SidebarHeader>
              <Link href="/admin-dashboard" className='flex items-center justify-center h-32'>
                <Image className='rounded-full w-1/2 mt-1 border-2 border-red-400' src={logo} alt='logo' />
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel></SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <div className='mb-2'>
                      <hr />
                    </div>

                    {menuItem != undefined && menuItem.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton className='font-bold hover:rounded-3xl hover:bg-zinc-500 hover:text-gray-100' >
                          <Link href={item.url} className='flex flex-row items-center gap-2'>
                            <item.icon />
                            <span className='font-bold'>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    <div className='mt-3 mb-3'>
                      <hr />
                    </div>
                    <SidebarMenuItem>
                      <SidebarMenuButton className='font-bold hover:rounded-3xl hover:bg-zinc-500 hover:text-gray-100'>
                        <Link href="/reports/order/detail" className='flex flex-row items-center gap-2 '>
                          <VscListFlat />
                          <span className='font-bold'>Order Detail Between Dates</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton className='font-bold hover:rounded-3xl hover:bg-zinc-500 hover:text-gray-100'>
                        <Link href="/reports/product" className='flex flex-row items-center gap-2 '>
                          <VscListSelection />
                          <span className='font-bold'>List of Product</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton className='font-bold hover:rounded-3xl hover:bg-zinc-500 hover:text-gray-100'>
                        <Link href="/reports/category" className='flex flex-row items-center gap-2 '>
                          <VscListSelection />
                          <span className='font-bold'>List of Category</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
          </Sidebar>
        </>}

    </>
  )
}

export default AppSidebar
