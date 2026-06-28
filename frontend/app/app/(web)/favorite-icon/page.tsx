import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FavoriteIcon = () => {
  return (
   <Link href={"/cart"} className="group relative">
      <Heart className="w-5 h-5 hover: text-gray-600 hoverEffect" />
      <span className="absolute -top-1 -right-1 text-white bg-green-900 h-3.5 w-3.5 text-xs rounded-full flex justify-center font-semibold">0</span>
    </Link>
  )
}

export default FavoriteIcon
