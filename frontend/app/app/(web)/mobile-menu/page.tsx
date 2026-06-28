'use client'
import SideMenu from '@/components/sidebar-menu'
import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'

const MobileMenu = () => {
    const[isOpenSidebar, setIsOpenSidebar] = useState(false)
    return (
        <>
            <button onClick={()=>setIsOpenSidebar(!isOpenSidebar)}>
                <AlignLeft className='hover:text-secondary hoverEffect md:hidden hover:cursor-pointer' />
            </button>
            <div className='md:hidden'>
                <SideMenu
                    isOpen={isOpenSidebar} 
                    onClose={()=>setIsOpenSidebar(false)}
                />
            </div>
            
        </>
    )
}

export default MobileMenu