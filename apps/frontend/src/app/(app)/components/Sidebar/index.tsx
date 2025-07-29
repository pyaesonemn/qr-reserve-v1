import FeedbackBox from "./FeedbackBox";
import NavigationBox from "./NavigationBox";
import ProfileBox from "./ProfileBox";

const Sidebar = () => {
  return (
    <aside className="flex flex-col justify-between w-[18rem] font-ubuntu">
      <NavigationBox />
      <div className="flex flex-col gap-y-3">
        <FeedbackBox />
        <ProfileBox />
      </div>
    </aside>
  );
};

export default Sidebar;
