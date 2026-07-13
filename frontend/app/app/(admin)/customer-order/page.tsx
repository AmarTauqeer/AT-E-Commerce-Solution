import { Suspense } from "react";
import { CustomerOrderDataTable } from "@/components/order/customer-order-data-table";

const CustomerOrder = async () => {

  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">Customer Order</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
     
    return <CustomerOrderDataTable />
}

export default CustomerOrder;
