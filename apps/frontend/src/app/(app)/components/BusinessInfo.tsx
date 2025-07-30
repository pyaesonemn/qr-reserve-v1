import { ArrowUpRightIcon } from "lucide-react";

const BusinessInfo = () => {
  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-sm p-2">
      <div className="h-full flex flex-col justify-around">
        <div className="h-full my-1 px-3 py-1 cursor-pointer rounded-2xl flex flex-row justify-between items-center hover:bg-neutral-100">
          <div>
            <h6 className="text-base -mb-1 text-neutral-900 font-semibold font-poppins capitalize">
              Create a session.
            </h6>
            <span className="text-xs text-neutral-500 font-normal">
              Have a great start with Lazy Reserve
            </span>
          </div>
          <div>
            <ArrowUpRightIcon className="w-5 h-5 text-neutral-700" />
          </div>
        </div>
        <div className="w-full h-[1px] bg-neutral-200" />
        <div className="h-full my-1 px-3 py-1 cursor-pointer rounded-2xl flex flex-row justify-between items-center hover:bg-neutral-100">
          <div>
            <h6 className="text-base -mb-1 text-neutral-900 font-semibold font-poppins capitalize">
              Create a session.
            </h6>
            <span className="text-xs text-neutral-500 font-normal">
              Have a great start with Lazy Reserve
            </span>
          </div>
          <div>
            <ArrowUpRightIcon className="w-5 h-5 text-neutral-700" />
          </div>
        </div>
        {/* <Button>Edit</Button> */}
      </div>
    </div>
  );
};

export default BusinessInfo;
