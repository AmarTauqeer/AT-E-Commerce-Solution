'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import logo from "../public/company-logo.jpg"

const Logo = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

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
    <div className='mt-4'>



      <Link href={"/about"}>
        <h2 className={cn("hoverEffect group", className)}>
          <Image className='rounded-full' src={logo} alt='logo' width={60} height={60} />
        </h2>
      </Link>
    </div>
  )
}

export default Logo
