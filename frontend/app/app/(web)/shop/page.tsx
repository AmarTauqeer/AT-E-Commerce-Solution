import FetchingDataSkeleton from "@/components/fetching-data-skeleton";
import ShopComponent from "@/components/shop/shop-component";
import { FC, Suspense } from "react";

const Shop = async () => {

  return (
    <div>
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
