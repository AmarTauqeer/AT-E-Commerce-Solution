import FetchingDataSkeleton from "@/components/fetching-data-skeleton";
import { Profile } from "@/components/user/profile";
import { Suspense } from "react";
const User = async () => {
  return (
    <div className="">
      <div className=" py-5">
        <Suspense fallback={<FetchingDataSkeleton />}>
          <SuspendedData />
        </Suspense>
      </div>
    </div>
  );
};

async function SuspendedData() {
  return <Profile />
}

export default User
