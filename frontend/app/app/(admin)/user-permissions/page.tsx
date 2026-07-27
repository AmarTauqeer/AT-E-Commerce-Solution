import { Suspense } from "react";
import { PermissionsDataTable } from "@/components/user-permissions/permission-data-table";
import FetchingDataSkeleton from "@/components/fetching-data-skeleton";

const Permissions = async () => {
  
  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">User Permissions</h1>
        <Suspense fallback={<FetchingDataSkeleton />}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
    return <PermissionsDataTable  />
}



export default Permissions;