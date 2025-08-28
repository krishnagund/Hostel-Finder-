import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";

const StudentInbox = () => {
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch messages
  useEffect(() => {
    if (!isLoggedin) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendurl}/api/messages/student`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Student inbox load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedin, backendurl]);

  if (!isLoggedin) {
    return (
      <div className="p-6 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">Inbox</h2>
        <p className="text-gray-600">Please log in to see your messages.</p>
      </div>
    );
  }

  // Group messages by property ID
  const groupedByProperty = Object.values(
    messages.reduce((acc, m) => {
      if (!acc[m.property?._id]) acc[m.property?._id] = [];
      acc[m.property?._id].push(m);
      return acc;
    }, {})
  );

  // Mark messages read API
  const markAsRead = async (propertyId) => {
    try {
      await fetch(`${backendurl}/api/messages/read-student`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.property?._id === propertyId ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error("Error marking messages read:", err);
    }
  };

  // Handle clicking a property
  const handleSelectProperty = (propertyId) => {
    setSelectedProperty(propertyId);
    markAsRead(propertyId);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-center">My Inbox</h2>

      {loading ? (
        <p className="text-center">Loading messages…</p>
      ) : groupedByProperty.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <ul className="max-w-3xl mx-auto space-y-3">
          {groupedByProperty.map((msgs) => {
            const m = msgs[0]; // representative message
            const unreadCount = msgs.filter((msg) => !msg.read).length;

            return (
              <li
                key={m.property._id}
                className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition cursor-pointer"
                onClick={() => handleSelectProperty(m.property._id)}
              >
                {/* Property & contact info */}
                <div className="font-medium">
                 From: {m.sender?.name || "Unknown Owner"} — {m.property.heading} — {m.property.city} — ₹{m.property.rent}
                </div>

                <div className="text-xs text-gray-500">
                  {m.sender.phone} — {m.sender.email}
                </div>

                {/* Medium */}
                <div className="text-xs text-gray-400 mt-1">
                  Medium: {m.medium || "Message"}
                </div>

                {/* Unread badge */}
                {unreadCount > 0 && (
                  <span className="inline-block mt-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    {unreadCount} new
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Message details modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <button
              onClick={() => setSelectedProperty(null)}
              className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back
            </button>

            <h3 className="text-xl font-semibold mb-4">Messages</h3>

            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {messages
                .filter((msg) => msg.property?._id === selectedProperty)
                .map((msg) => (
                  <li key={msg._id} className="border p-3 rounded bg-gray-50">
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                    {msg.content && (
                      <div className="text-gray-800">{msg.content}</div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInbox;
