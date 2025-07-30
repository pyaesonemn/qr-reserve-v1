import Header from "../components/Header";
import AnalyticsPreview from "../components/AnalyticsPreview";
import BusinessInfo from "../components/BusinessInfo";

export default function DashboardPage() {
  return (
    <div className="p-4 text-neutral-900 flex flex-col gap-y-4">
      <Header />
      <div className="grid grid-cols-3 gap-x-3">
        <div className="col-span-2">
          <AnalyticsPreview />
        </div>
        <div className="col-span-1">
          <BusinessInfo />
        </div>
      </div>
    </div>
  );
}
