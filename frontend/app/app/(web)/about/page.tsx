'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from "motion/react"


const About = () => {
  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}>
        <h1 className="text-3xl font-bold">About A & T Company</h1>

        <p className="text-muted-foreground text-xl mt-2">
          We Make Online Shopping Simple, Secure & Better.
        </p>

        <p className='text-md text-justify mt-2'>
          At A & T Company, we believe online shopping should be simple, reliable, and enjoyable. Our e-commerce platform brings quality products, convenient shopping, secure payments, and dependable service together in one place.

          We started A & T Company with a simple goal: to make it easier for customers to find the products they need and enjoy a seamless shopping experience from browsing to delivery.
        </p>


        <p className="text-muted-foreground text-xl mt-2">
          Who We Are
        </p>

        <p className='text-lg text-justify mt-2'>
          A & T Company is a modern e-commerce business focused on providing customers with a convenient and trustworthy way to shop online.

          From carefully selected products to a lgooth checkout experience, every part of our platform is designed with our customers in mind.

          We combine modern technology with customer-focused service to create an online shopping experience that is fast, accessible, and dependable.
        </p>

        <p className="text-muted-foreground text-xl mt-2">
          What We Believe
        </p>

        <p className="text-muted-foreground text-lg mt-2">
          Customer First
        </p>

        <p className='text-md text-justify mt-2'>
          Our customers are at the heart of everything we do. We listen to feedback and continuously improve our products, services, and shopping experience.
        </p>

        <p className="text-muted-foreground text-lg mt-2">
          Quality Matters
        </p>

        <p className='text-lg text-justify mt-2'>
          We believe customers deserve products they can trust. That's why we focus on quality, value, and reliable product information.
        </p>

        <p className="text-muted-foreground text-lg mt-2">
          Technology With Purpose
        </p>

        <p className='text-lg text-justify mt-2'>
          Technology should make life easier. Our platform uses modern e-commerce technology to make browsing, ordering, payment, and order management simple and convenient.
        </p>

      </motion.div>
      <span className='mt-10'>*Text from <a href='https://chatgpt.com/'> ChatGPT</a></span>


    </div>
  )
}

export default About