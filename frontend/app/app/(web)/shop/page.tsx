import ShopComponent from "@/components/shop/shop-component";
import { FC } from "react";


interface Product{
  category_id: number,
  product_name:string,
  image_path?:string,
  sale_price?:number,
  purchase_price?:number,
  created_at? :Date,
  updated_at?: Date
  id?:number
}

interface productProps{
    products:Product[]
}


const Shop:FC<productProps> = async () => {

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 px-2 mt-2">Shop</h3>
        <ShopComponent />
    </div>
      
  )
}

export default Shop
