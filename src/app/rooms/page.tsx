import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Rooms } from "@/components/Tables/top-rooms";
import { TopChannelsSkeleton } from "@/components/Tables/top-rooms/skeleton";
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
          <Rooms />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;