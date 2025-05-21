import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Users } from "@/components/Tables/top-users";
import { TopChannelsSkeleton } from "@/components/Tables/top-users/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />
      <div className="space-y-10">
        <Suspense fallback={<TopChannelsSkeleton />}>
          <Users />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;