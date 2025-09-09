import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const buildStorageKey = (userId, role) => `profile_nudge_dismissed_${role}_${userId || 'anon'}`;

const ProfileNudge = ({ userData, role, onAction, isLoggedin }) => {
  const navigate = useNavigate();
  const userId = userData?._id || userData?.id || "";

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = buildStorageKey(userId, role);
    if (isLoggedin) {
      const val = sessionStorage.getItem(key);
      setDismissed(val === "1");
    } else {
      // On logout, clear dismissal so it shows again on next login
      sessionStorage.removeItem(key);
      setDismissed(false);
    }
  }, [userId, role, isLoggedin]);

  const missingItems = useMemo(() => {
    const items = [];
    if (!userData) {
      // If userData is not loaded yet, assume profile is incomplete
      return ["Profile data"];
    }

    const hasPhone = Boolean((userData.phone || "").toString().trim());
    if (!hasPhone) items.push("Phone number");

    if (role === "student") {
      const college = userData.studentProfile?.college || "";
      if (!college.trim()) items.push("College");
    }

    return items;
  }, [userData, role]);

  if (dismissed || missingItems.length === 0) return null;

  const handleFixNow = () => {
    if (typeof onAction === "function") {
      onAction();
      return;
    }
    if (role === "student") {
      navigate("/student-profile");
    }
  };

  const handleDismiss = () => {
    const key = buildStorageKey(userId, role);
    sessionStorage.setItem(key, "1");
    setDismissed(true);
  };

  return (
    <div className="mx-4 sm:mx-6 my-4">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-semibold mb-1">Complete your profile</p>
          <p className="text-sm">
            You're almost there. Please add: {missingItems.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleFixNow}
            className="px-3 py-2 rounded-md bg-[#3A2C99] text-white hover:bg-white hover:text-[#3A2C99] transition border border-[#3A2C99] text-sm"
          >
            Fix now
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 rounded-md bg-transparent text-yellow-900 hover:bg-yellow-100 transition border border-yellow-300 text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNudge;


