import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FaWhatsapp, FaPhone, FaSms, FaEnvelope } from "react-icons/fa";

const InboxTab = () => {
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedin) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendurl}/api/messages/my`, {
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

  const groupedMessages = {};
  messages.forEach((msg) => {
    const senderId = msg.sender._id;
    if (!groupedMessages[senderId]) {
      groupedMessages[senderId] = {
        sender: msg.sender,
        messages: [],
      };
    }
    groupedMessages[senderId].messages.push(msg);
  });

  const handleSelectSender = (senderId, email) => {
    // Mark messages as read
    fetch(`${backendurl}/api/messages/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
  };

  const markAsRead = async (email) => {
    try {
      await fetch(`${backendurl}/api/messages/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const logInteraction = (type, contact) => {
    console.log(`${type} interaction with ${contact}`);
  };

  if (!isLoggedin) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Inbox</h2>
        <p className="text-gray-600">Please log in to see your messages.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-3 sm:p-4 bg-gray-50 min-h-screen">
      {/* Sidebar: message list */}
      {!loading && (
        <div className="w-full md:w-1/3 bg-white p-3 sm:p-4 rounded shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Messages</h3>
          
          {messages.length === 0 ? (
            <p className="text-gray-600">No messages yet.</p>
          ) : (
            <ul className="space-y-2">
              {Object.values(groupedMessages).map((group) => (
                <li
                  key={group.sender._id}
                  className="border p-3 rounded cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => handleSelectSender(group.sender._id, group.sender.email)}
                >
                  <div className="font-medium text-sm">
                    {group.sender.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {group.sender.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {group.messages.length} message{group.messages.length !== 1 ? "s" : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Main content: contact options */}
      <div className="w-full md:w-2/3 bg-white rounded shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Contact Options</h3>
        
        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-600">No messages to display contact options for.</p>
        ) : (
          <div className="space-y-4">
            {Object.values(groupedMessages).map((group) => (
              <div key={group.sender._id} className="border rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-semibold">{group.sender.name}</h4>
                  <p className="text-sm text-gray-600">{group.sender.email}</p>
                  {group.sender.phone && (
                    <p className="text-sm text-gray-600">Phone: {group.sender.phone}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => logInteraction("WhatsApp", group.sender.phone)}
                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={() => logInteraction("Call", group.sender.phone)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                  >
                    <FaPhone />
                    Call
                  </button>
                  
                  <button
                    onClick={() => logInteraction("SMS", group.sender.phone)}
                    className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
                  >
                    <FaSms />
                    SMS
                  </button>
                  
                  <button
                    onClick={() => logInteraction("Email", group.sender.email)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition"
                  >
                    <FaEnvelope />
                    Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxTab;
