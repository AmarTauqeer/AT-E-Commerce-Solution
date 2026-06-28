import { Suspense } from "react";
import { getPermission } from "@/app/services/user-permissions";
import { PermissionsDataTable } from "@/components/user-permissions/permission-data-table";

const Permissions = async () => {
  
  return (
    <div className="">
      <div className=" py-5">
        <h1 className="mb-5 font-bold text-2xl">User Permissions</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
    const response = await getPermission();
    return <PermissionsDataTable response={response} />
}



export default Permissions;