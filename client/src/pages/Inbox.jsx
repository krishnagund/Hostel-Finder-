import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FaWhatsapp, FaPhone, FaSms, FaEnvelope, FaClock } from "react-icons/fa";

const StudentInbox = () => {
  const { backendurl, isLoggedin, userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedin) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendurl}/api/messages/student`, {
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

  const groupedByProperty = {};
  messages.forEach((msg) => {
    const key = `${msg.property?._id || 'noprop'}_${msg.sender?._id || 'nosender'}`;
    if (!groupedByProperty[key]) {
      groupedByProperty[key] = {
        property: msg.property,
        sender: msg.sender,
        messages: [],
      };
    }
    groupedByProperty[key].messages.push(msg);
  });

  const markAsRead = async (email) => {
    try {
      const res = await fetch(`${backendurl}/api/messages/read-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Update local state immediately
        setMessages(prev => {
          const updated = prev.map(msg => 
            msg.sender?.email === email ? { ...msg, read: true } : msg
          );
          // Recalculate unread count from updated messages
          const newUnreadCount = updated.filter(msg => !msg.read).length;
          setUnreadCount(newUnreadCount);
          return updated;
        });
      } else {
        const errorData = await res.json();
        console.error("Failed to mark as read:", errorData);
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleSelectProperty = (propertyId, email) => {
    markAsRead(email);
    // You can add navigation logic here if needed
  };

  const refreshMessages = async () => {
    try {
      const res = await fetch(`${backendurl}/api/messages/student`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        const unread = data.messages.filter(msg => !msg.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error refreshing messages:", err);
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
      console.error("Error logging interaction:", e);
    }
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Inbox</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshMessages}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Refresh
          </button>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet.</div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-4">
          {Object.values(groupedByProperty).map((group) => {
            const hasUnread = group.messages.some(msg => !msg.read);
            return (
              <div
                key={group.property._id}
                className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition ${
                  hasUnread ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {group.property.heading}
                    </h3>
                    <p className="text-gray-600">
                      {group.property.city}, ₹{group.property.rent}
                    </p>
                    <p className="text-sm text-gray-500">
                      Owner: {group.sender.name} ({group.sender.email})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {group.messages.length} message
                      {group.messages.length !== 1 ? "s" : ""}
                    </p>
                    {hasUnread && (
                      <span className="inline-block mt-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {group.messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        msg.read ? "bg-gray-50" : "bg-blue-50 border-l-2 border-blue-400"
                      }`}
                      onClick={() => !msg.read && markAsRead(msg.sender.email)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center gap-2">
                          {msg.medium && (
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {msg.medium.toUpperCase()}
                            </span>
                          )}
                          {!msg.read && <FaClock className="text-blue-500" />}
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

                {/* Contact Options */}
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Owner:</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        if (group.sender.phone) {
                          window.open(`https://wa.me/91${group.sender.phone}`, "_blank");
                        }
                        logInteraction("whatsapp", group.sender, group.property);
                      }}
                      className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition text-sm"
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
                      className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition text-sm"
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
                      className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 transition text-sm"
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
                      className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition text-sm"
                    >
                      <FaEnvelope />
                      Email
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentInbox;
