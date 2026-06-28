"use client";

import { getCategories } from "@/app/services/category";
import { CategoryReport } from "@/components/category/category-report-component";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

export default function CategoryReportViewer() {
    const [categories, setCatgories] = useState([])
    useEffect(()=>{
        const getData = async()=>{
            const response = await getCategories()
            if(response) setCatgories(response);

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
      <CategoryReport
        categories={categories}
      />
    </PDFViewer>
  );
}