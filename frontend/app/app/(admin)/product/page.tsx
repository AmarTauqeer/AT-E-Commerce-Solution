import { Suspense } from "react";
import { getProducts } from "@/app/services/product";
import { ProductDataTable } from "@/components/product/product-data-table";


const Product = async () => {
  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">Product</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
    const response = await getProducts();
    return <ProductDataTable response={response} />
}

export default Product;