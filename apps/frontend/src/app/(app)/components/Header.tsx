import { BellIcon } from "lucide-react";

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-neutral-900 font-poppins text-xl font-medium">
        User&apos;s Dashboard
      </h1>
      <div className="group p-2 bg-neutral-200 cursor-pointer rounded-lg">
        <BellIcon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900" />
      </div>
    </div>
  );
};

export default Header;
