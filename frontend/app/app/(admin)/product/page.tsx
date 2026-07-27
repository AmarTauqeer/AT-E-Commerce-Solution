import { Suspense } from "react";
import { ProductDataTable } from "@/components/product/product-data-table";
import FetchingDataSkeleton from "@/components/fetching-data-skeleton";


const Product = async () => {
  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">Product</h1>
        <Suspense fallback={<FetchingDataSkeleton />}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
    return <ProductDataTable />
}

export default Product;