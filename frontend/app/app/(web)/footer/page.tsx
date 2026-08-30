'use client'
import SocialMedia from "@/components/social-media"
import Link from "next/link"
import logo from "../../../public/company-logo.jpg"
import Image from "next/image"
import { motion } from "motion/react"

const Footer = () => {
  return (
    <>
      <motion.div initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }} className="border rounded-2xl py-1 shadow-sm bg-card flex justify-center">
        <div className="grid grid-cols-3 gap-2 p-2  md:w-7xl">
          <div className="flex flex-col">
            <Image className="rounded-full" src={logo} alt="logo" width={60} height={60} />
            <span>Discount on sale</span>
            <SocialMedia />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Quick Links</span>
            <Link href={"/about"} className="font-sm text-sm hover:cursor-pointer hoveEffect">About Us</Link>
            <Link href={"/shop"} className="font-sm text-sm hover:cursor-pointer hoveEffect">Shop</Link>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-lg">Categories</span>
            <Link href={"/shop"} className="font-sm text-sm hover:cursor-pointer hoveEffect">Mobile</Link>
            <Link href={"/shop"} className="font-sm text-sm hover:cursor-pointer hoveEffect">Laptop</Link>
            <Link href={"/shop"} className="font-sm text-sm hover:cursor-pointer hoveEffect">Ipad</Link>
          </div>

        </div>

      </motion.div>
      <motion.div initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center font-semibold mb-2">
        <p>Copyright © 2026. All Rights Reserved.
        </p>
      </motion.div>

    </>
  )
}

export default Footer
