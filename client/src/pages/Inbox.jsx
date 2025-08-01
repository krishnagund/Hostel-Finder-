import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Inbox = () => {
  const { isLoggedin } = useContext(AppContext);

  if (!isLoggedin) {
    return <div className="p-4 text-red-500">Please login to view inbox.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      <p className="text-gray-600">No new messages.</p>
      {/* Later you can fetch inbox messages from backend */}
    </div>
  );
};

export default Inbox;
