"use client";

import { getCategories } from "@/app/services/category";
import { getProducts } from "@/app/services/product";
import { ProductReport } from "@/components/product/product-report-component";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

export default function ProductReportViewer() {
    const [products, setProducts] = useState([])
    useEffect(()=>{
        const getData = async()=>{
            const responseCategories = await getCategories()
            const resposneProducts = await getProducts()
            let array:any=[];
            resposneProducts.forEach((p:any) => {
                const filterCategories = responseCategories.filter((c:any)=>c.id==p.category_id)
                const categoryName = filterCategories[0].category_name
                const newData ={
                    id: p.id,
                    product_name: p.product_name,
                    price: p.sale_price,
                    category_name: categoryName,
                    product_description: p.product_description,
                    created_at: p.created_at
                }
                console.log(newData)
                if (newData) {
                    array.push(newData)
                }
            });
            if(array.length>0) setProducts(array);
        }
        getData()
    },[])

  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <ProductReport
        products={products}
      />
    </PDFViewer>
  );
}