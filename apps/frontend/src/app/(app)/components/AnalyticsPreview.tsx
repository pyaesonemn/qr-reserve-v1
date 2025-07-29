import { cn } from "@/lib/utils";
import {
  CalendarCheckIcon,
  CalendarClockIcon,
  ExternalLinkIcon,
  LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, FC } from "react";

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
  valueColor: string;
}

const Card: FC<CardProps> = ({ title, value, icon, valueColor }) => {
  return (
    <div className="bg-white w-full rounded-2xl">
      <div className="flex flex-row justify-between items-center py-2 px-4">
        <div className="flex flex-col gap-y-2">
          <h6 className="text-neutral-700 text-xs font-poppins font-semibold">
            {title}
          </h6>
          <div
            className={cn(
              "text-neutral-900 font-normal text-2xl flex flex-row items-center-safe gap-x-2",
              valueColor
            )}
          >
            {icon}
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPreview = () => {
  const analyticsData = [
    {
      title: "Confirmed Bookings",
      value: 50,
      icon: CalendarCheckIcon,
      valueColor: "text-green-700",
    },
    {
      title: "Pending Bookings",
      value: 30,
      icon: CalendarClockIcon,
      valueColor: "text-yellow-700",
    },
    {
      title: "Left for Today",
      value: 6,
      icon: LoaderIcon,
      valueColor: "text-neutral-700",
    },
  ];
  return (
    <div className="bg-gradient-to-bl from-0% from-black/85 via-35% via-black/70 to-100% to-black/80 backdrop-blur-md w-full p-2 rounded-3xl shadow-xl font-ubuntu">
      <div className="p-2 flex flex-row justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100 font-poppins -mb-1">
            Analytics Preview
          </h3>
          <span className="text-neutral-300 text-xs">
            See how you doing with your business.
          </span>
        </div>
        <Link
          href="/analytics"
          className="group flex flex-row items-center-safe gap-x-1 text-neutral-300 text-xs cursor-pointer hover:underline"
        >
          View detailed analytics{" "}
          <ExternalLinkIcon className="w-3 h-3 group-hover:underline" />
        </Link>
      </div>
      <div className="flex flex-row gap-x-2 justify-between items-center">
        {analyticsData.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            value={item.value}
            valueColor={item.valueColor}
            icon={<item.icon size={24} />}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPreview;
