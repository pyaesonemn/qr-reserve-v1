import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronUpIcon } from "lucide-react";

const ProfileBox = () => {
  return (
    <div className="bg-gradient-to-bl from-0% from-white/20 via-35% via-white/5 to-100% to-white/15 backdrop-blur-md shadow-xl shadow-black/10 p-4 rounded-3xl">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-x-4">
          <Avatar className="bg-white text-lg text-neutral-900 font-bold w-12 h-12">
            <AvatarImage src="/placeholder.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-neutral-300 text-sm font-poppins font-semibold">
              John Done
            </span>
            <span className="text-neutral-500 text-xs">jd@company.com</span>
          </div>
        </div>
        <ChevronUpIcon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default ProfileBox;
