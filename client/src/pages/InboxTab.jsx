import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FaWhatsapp, FaPhone, FaSms, FaEnvelope } from "react-icons/fa";

const InboxTab = () => {
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedin) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendurl}/api/messages/my`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          // Calculate unread count
          const unread = data.messages.filter(msg => !msg.read).length;
          setUnreadCount(unread);
        }
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
    const key = `${msg.sender?._id || 'nosender'}_${msg.property?._id || 'noprop'}`;
    if (!groupedMessages[key]) {
      groupedMessages[key] = {
        sender: msg.sender,
        property: msg.property,
        messages: [],
      };
    }
    groupedMessages[key].messages.push(msg);
  });

  const handleSelectSender = (senderId, email) => {
    // Mark messages as read
    fetch(`${backendurl}/api/messages/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    })
      .then(() => {
        // Update local state immediately
        setMessages((prev) => {
          const updated = prev.map((m) => (
            m.sender?.email === email ? { ...m, read: true } : m
          ));
          // Recalculate unread count from updated messages
          const newUnreadCount = updated.filter(msg => !msg.read).length;
          setUnreadCount(newUnreadCount);
          return updated;
        });
      })
      .catch(() => {
        // ignore errors here; server state remains source of truth on refetch
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

  const logInteraction = async (type, sender, property) => {
    try {
      await fetch(`${backendurl}/api/messages/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiverId: sender._id, propertyId: property?._id, medium: type }),
      });
    } catch (e) {
      // no-op
    }
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
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold">Messages</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          {messages.length === 0 ? (
            <p className="text-gray-600">No messages yet.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(groupedMessages).map(([key, group]) => {
                const hasUnread = group.messages.some(msg => !msg.read);
                return (
                  <li
                    key={key}
                    className={`border p-3 rounded cursor-pointer hover:bg-gray-50 transition ${
                      hasUnread ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectSender(group.sender._id, group.sender.email)}
                  >
                    <div className="font-medium text-sm flex justify-between items-center">
                      <span>{group.sender?.name}</span>
                      {hasUnread && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {group.sender?.email}
                    </div>
                    {group.property?.heading && (
                      <div className="text-xs text-gray-600">
                        Listing: {group.property.heading}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {group.messages.length} message{group.messages.length !== 1 ? "s" : ""}
                    </div>
                  </li>
                );
              })}
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
            {Object.entries(groupedMessages).map(([key, group]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-semibold">{group.sender.name}</h4>
                  <p className="text-sm text-gray-600">{group.sender.email}</p>
                  {group.property?.heading && (
                    <p className="text-xs text-gray-500">Listing: {group.property.heading}</p>
                  )}
                  {group.sender.phone && (
                    <p className="text-sm text-gray-600">Phone: {group.sender.phone}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (group.sender.phone) {
                        window.open(`https://wa.me/91${group.sender.phone}`, "_blank");
                      }
                      logInteraction("whatsapp", group.sender, group.property);
                    }}
                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={() => {
                      if (group.sender.phone) {
                        window.location.href = `tel:+91${group.sender.phone}`;
                      }
                      logInteraction("call", group.sender, group.property);
                    }}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                  >
                    <FaPhone />
                    Call
                  </button>
                  
                  <button
                    onClick={() => {
                      if (group.sender.phone) {
                        window.location.href = `sms:+91${group.sender.phone}`;
                      }
                      logInteraction("sms", group.sender, group.property);
                    }}
                    className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
                  >
                    <FaSms />
                    SMS
                  </button>
                  
                  <button
                    onClick={() => {
                      if (group.sender.email) {
                        window.location.href = `mailto:${group.sender.email}`;
                      }
                      logInteraction("email", group.sender, group.property);
                    }}
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
