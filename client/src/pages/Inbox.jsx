import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";

const StudentInbox = () => {
  const { backendurl, isLoggedin, userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedin) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendurl}/api/messages/student`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isLoggedin, backendurl]);

  const groupedByProperty = {};
  messages.forEach((msg) => {
    const propertyId = msg.property._id;
    if (!groupedByProperty[propertyId]) {
      groupedByProperty[propertyId] = {
        property: msg.property,
        messages: [],
      };
    }
    groupedByProperty[propertyId].messages.push(msg);
  });

  const markAsRead = async (email) => {
    try {
      await fetch(`${backendurl}/api/messages/read-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleSelectProperty = (propertyId, email) => {
    markAsRead(email);
    // You can add navigation logic here if needed
  };

  if (!isLoggedin) {
    return (
      <div className="p-6 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">Inbox</h2>
        <p className="text-gray-600">Please log in to see your messages.</p>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-center">My Inbox</h2>

      {loading ? (
        <div className="text-center">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {Object.values(groupedByProperty).map((group) => (
            <div
              key={group.property._id}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
              onClick={() =>
                handleSelectProperty(
                  group.property._id,
                  group.messages[0].sender.email
                )
              }
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {group.property.heading}
                  </h3>
                  <p className="text-gray-600">
                    {group.property.city}, ₹{group.property.rent}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {group.messages.length} message
                    {group.messages.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {group.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-3 rounded-lg ${
                      msg.read ? "bg-gray-50" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">
                        From: {msg.sender.name} ({msg.sender.email})
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                    {msg.phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        Phone: {msg.phone}
                      </p>
                    )}
                    {msg.moveInDate && (
                      <p className="text-sm text-gray-600">
                        Move-in Date: {msg.moveInDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInbox;
