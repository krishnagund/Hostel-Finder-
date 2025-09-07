import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FaWhatsapp, FaPhone, FaSms, FaEnvelope, FaClock, FaUser } from "react-icons/fa";
import RenterInfo from "../components/RenterInfo";

const InboxTab = () => {
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedSender, setSelectedSender] = useState(null);

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

  const handleSelectSender = (senderId, email, group) => {
    setSelectedSender(group);
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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Inbox Header */}
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              <RenterInfo text="My Inbox" />
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              <RenterInfo text="Manage your messages and communications" />
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="text-white bg-[#3A2C99] px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              <RenterInfo text="Refresh" />
            </button>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-2 rounded-full text-center font-medium">
                {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Content */}
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📬</div>
            <p className="text-gray-500 text-lg">
              <RenterInfo text="No messages yet" />
            </p>
            <p className="text-gray-400 text-sm mt-2">
              <RenterInfo text="You'll see student inquiries here when they contact you about your properties" />
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([key, group]) => {
              const hasUnread = group.messages.some(msg => !msg.read);
              const latestMessage = group.messages[group.messages.length - 1];
              
              return (
                <div
                  key={key}
                  className={`border rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer ${
                    hasUnread ? 'border-l-4 border-l-[#3A2C99] bg-blue-50' : 'border-gray-200'
                  } ${selectedSender?.sender?._id === group.sender?._id ? 'ring-2 ring-[#3A2C99]' : ''}`}
                  onClick={() => handleSelectSender(group.sender._id, group.sender.email, group)}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#3A2C99] rounded-full flex items-center justify-center text-white font-semibold">
                        <FaUser />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {group.sender?.name || 'Unknown Student'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {group.sender?.email}
                        </p>
                        {group.sender?.phone && (
                          <p className="text-sm text-gray-600">
                            📞 {group.sender.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {hasUnread && (
                        <span className="bg-[#3A2C99] text-white text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {latestMessage?.createdAt ? new Date(latestMessage.createdAt).toLocaleDateString() : 'Unknown Date'}
                      </span>
                    </div>
                  </div>

                  {/* Property Info */}
                  {group.property && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        <RenterInfo text="Property Inquiry" />
                      </h4>
                      <p className="text-sm text-gray-700">
                        {group.property.heading || `${group.property.properttyType} in ${group.property.city}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        ₹{group.property.rent?.toLocaleString()} • {group.property.city}, {group.property.state}
                      </p>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="space-y-3 mb-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <RenterInfo text="Messages" />
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {group.messages.length}
                      </span>
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {group.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg text-sm ${
                            !msg.read ? 'bg-blue-100 border-l-2 border-blue-400' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                            <div className="font-medium flex items-center gap-2 flex-wrap">
                              {msg.medium && (
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded whitespace-nowrap">
                                  {msg.medium.toUpperCase()}
                                </span>
                              )}
                              {!msg.read && <FaClock className="text-blue-500 flex-shrink-0" />}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Unknown Date'}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm sm:text-base break-words">
                            {msg.content || 'No content'}
                          </p>
                          {msg.phone && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">
                              Phone: {msg.phone}
                            </p>
                          )}
                          {msg.moveInDate && (
                            <p className="text-xs sm:text-sm text-gray-600 break-words">
                              Move-in Date: {msg.moveInDate}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      <RenterInfo text="Contact Student" />
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.sender?.phone && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://wa.me/91${group.sender.phone}`, "_blank");
                              logInteraction("whatsapp", group.sender, group.property);
                            }}
                            className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            <FaWhatsapp />
                            WhatsApp
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:+91${group.sender.phone}`;
                              logInteraction("call", group.sender, group.property);
                            }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <FaPhone />
                            Call
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `sms:+91${group.sender.phone}`;
                              logInteraction("sms", group.sender, group.property);
                            }}
                            className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                          >
                            <FaSms />
                            SMS
                          </button>
                        </>
                      )}
                      
                      {group.sender?.email && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${group.sender.email}`;
                            logInteraction("email", group.sender, group.property);
                          }}
                          className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          <FaEnvelope />
                          Email
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxTab;
