import {
  MenuIcon,
  HouseIcon,
  BriefcaseBusinessIcon,
  ListMinusIcon,
  ChartPieIcon,
} from "lucide-react";

const sidebarMenus = [
  {
    name: "Dashboard",
    icon: HouseIcon,
    path: "/dashboard",
  },
  {
    name: "Session",
    icon: BriefcaseBusinessIcon,
    path: "/session",
  },
  {
    name: "Bookings",
    icon: ListMinusIcon,
    path: "/bookings",
  },
  {
    name: "Analytics",
    icon: ChartPieIcon,
    path: "/analytics",
  },
];

const NavigationBox = () => {
  return (
    <div className="bg-gradient-to-bl from-0% from-white/20 via-35% via-white/5 to-100% to-white/15 backdrop-blur-md rounded-3xl shadow-xl shadow-black/10 h-fit p-4">
      <div className="mb-4 flex flex-row justify-between items-center-safe">
        <h1 className="text-white text-xl font-medium font-poppins">
          Lazy Appointment
        </h1>
        <div>
          <MenuIcon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        {sidebarMenus.map((menu) => (
          <div
            key={menu.name}
            className="group hover:cursor-pointer last:mb-0 mb-2 py-1 p-1 rounded-4xl hover:bg-neutral-200/20 flex flex-row items-center gap-x-4"
          >
            <div className="bg-neutral-500/20 group-hover:bg-neutral-500/50 p-3 rounded-full">
              <menu.icon className="w-5 h-5 font-normal text-white" />
            </div>
            <span className="text-white text-base font-poppins font-normal">
              {menu.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationBox;
