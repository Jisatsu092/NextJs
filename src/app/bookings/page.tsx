import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Bookings } from "@/components/Tables/top-bookings";
import { TopChannelsSkeleton } from "@/components/Tables/top-bookings/skeleton";
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
          <Bookings />
        </Suspense>
      </div>
    </>
  );
};

export default TablesPage;