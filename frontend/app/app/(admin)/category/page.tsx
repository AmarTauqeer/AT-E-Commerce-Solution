import { Suspense } from "react";
import { CategoryDataTable } from "@/components/category/category-data-table";


const Category = async () => {
  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">Category</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
   
    return <CategoryDataTable />
}

export default Category;