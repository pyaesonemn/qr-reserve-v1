import { Button } from "@/components/ui/button";

const FeedbackBox = () => {
  return (
    <div className="bg-white p-4 rounded-3xl">
      <div className="mb-4">
        <h6 className="mb-1 text-base text-neutral-900 font-semibold font-poppins capitalize">
          Your feedbacks matter.
        </h6>
        <p className="text-xs text-neutral-500 font-normal">
          Tell us what you think about this app. So that next improvements are
          for you.
        </p>
      </div>
      <Button className="rounded-full w-full font-poppins">
        Give my thoughts
      </Button>
    </div>
  );
};

export default FeedbackBox;
