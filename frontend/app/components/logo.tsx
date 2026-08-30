'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import logo from "../public/company-logo.jpg"
import { motion } from 'motion/react'

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
        <motion.h2 initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }} className={cn("hoverEffect group", className)}>
          <Image className='rounded-full' src={logo} alt='logo' width={60} height={60} />
        </motion.h2>
      </Link>
    </div>
  )
}

export default Logo
