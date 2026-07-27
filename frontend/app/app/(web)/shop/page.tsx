import FetchingDataSkeleton from "@/components/fetching-data-skeleton";
import ShopComponent from "@/components/shop/shop-component";
import { FC, Suspense } from "react";

const Shop = async () => {

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 px-2 mt-2">Shop</h3>
      <Suspense fallback={<FetchingDataSkeleton />}>
        <SuspendedData />
      </Suspense>
    </div>

  )
}

async function SuspendedData() {

  return <ShopComponent />
}

export default Shop
