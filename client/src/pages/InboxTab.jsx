import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import { FaWhatsapp, FaPhone, FaSms, FaEnvelope } from "react-icons/fa";

const InboxTab = () => {
  const { backendurl, isLoggedin } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Fetch messages
  useEffect(() => {
    if (!isLoggedin) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendurl}/api/messages/my`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (e) {
        console.error("Inbox load error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedin, backendurl]);

  if (!isLoggedin) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Inbox</h2>
        <p className="text-gray-600">Please log in to see your messages.</p>
      </div>
    );
  }

  // Group messages by sender email
  const groupedMessages = messages.reduce((acc, msg) => {
    const senderEmail = msg.sender?.email || "unknown";
    if (!acc[senderEmail]) acc[senderEmail] = [];
    acc[senderEmail].push(msg);
    return acc;
  }, {});

  const senderEmails = Object.keys(groupedMessages);

  // Handle selecting a sender
  const handleSelectSender = async (email) => {
    setSelectedEmail(email);

    // Mark messages as read in backend
    try {
      await fetch(`${backendurl}/api/messages/read`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Update local state for read messages
      setMessages((prev) =>
        prev.map((msg) =>
          msg.email === email ? { ...msg, read: true } : msg
        )
      );
    } catch (e) {
      console.error("Error marking messages as read", e);
    }
  };

  // Function to log interactions (WhatsApp/SMS/Email/Call)
  const logInteraction = async (receiverId, medium, content = "", propertyId) => {
    try {
      await fetch(`${backendurl}/api/messages/log`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, medium: medium.toLowerCase(), content, propertyId }),
      });
    } catch (err) {
      console.error("Error logging interaction:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-3 sm:p-4 bg-gray-50 min-h-screen">
      {/* Sidebar: sender list */}
      {!selectedEmail && (
        <div className="w-full md:w-1/3 bg-white p-3 sm:p-4 rounded shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Senders</h3>
          {loading ? (
            <p>Loading…</p>
          ) : senderEmails.length === 0 ? (
            <p className="text-gray-600">No messages found.</p>
          ) : (
            <ul className="space-y-2">
              {senderEmails.map((email) => {
                const isUnread = groupedMessages[email].some((m) => !m.read);
                return (
                  <li
                    key={email}
                    onClick={() => handleSelectSender(email)}
                    className="relative cursor-pointer p-3 rounded border hover:bg-blue-50 hover:border-blue-400 transition flex justify-between items-center"
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">
                        {groupedMessages[email][0].sender?.name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm truncate">
                        {groupedMessages[email][0].sender?.email}
                      </div>
                    </div>
                    {isUnread && (
                      <span className="ml-2 inline-block bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {groupedMessages[email].length}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Messages Panel */}
      {selectedEmail && (
        <div className="w-full md:w-2/3 bg-white p-3 sm:p-4 rounded shadow-md mt-3 md:mt-0 md:ml-4">
          <button
            onClick={() => setSelectedEmail(null)}
            className="mb-3 sm:mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 text-sm"
          >
            ← Back
          </button>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 break-words">
            Messages from {groupedMessages[selectedEmail][0].sender?.name} &lt;
            {groupedMessages[selectedEmail][0].sender?.email}&gt;
          </h3>

          <ul className="space-y-3 sm:space-y-4">
            {groupedMessages[selectedEmail].map((m) => (
              <li key={m._id} className="border p-3 sm:p-4 rounded shadow-sm bg-gray-50">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="text-gray-800 mb-2 text-sm sm:text-base break-words">{m.content}</div>

                {/* Contact Buttons */}
                {m.sender?.phone && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${m.sender.phone}?text=${encodeURIComponent(
                        `Hello, I saw your inquiry about ${m.property?.heading || ""}`
                      )}`}
                      target="_blank"
                      className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() =>
                        logInteraction(
                          m.sender?._id,
                          "WhatsApp",
                          `Hello, I saw your inquiry about ${m.property?.heading || ""}`,
                          m.property?._id
                        )
                      }
                    >
                      <FaWhatsapp /> WhatsApp
                    </a>

                    {/* Call */}
                    <a
                      href={`tel:${m.sender.phone}`}
                      className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() =>
                        logInteraction(m.sender?._id, "Call", "Call made", m.property?._id)
                      }
                    >
                      <FaPhone /> Call
                    </a>

                    {/* SMS */}
                    <a
                      href={`sms:${m.sender.phone}?body=${encodeURIComponent(
                        `Hello, I saw your inquiry about ${m.property?.heading || ""}`
                      )}`}
                      className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() =>
                        logInteraction(
                          m.sender?._id,
                          "SMS",
                          `Hello, I saw your inquiry about ${m.property?.heading || ""}`,
                          m.property?._id
                        )
                      }
                    >
                      <FaSms /> SMS
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${m.sender.email}?subject=${encodeURIComponent(
                        "Regarding your property inquiry"
                      )}&body=${encodeURIComponent(
                        `Hello ${m.sender?.name || ""},\n\nI saw your inquiry about ${m.property?.heading || ""}.\n\nRegards`
                      )}`}
                      className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                      onClick={() =>
                        logInteraction(
                          m.sender?._id,
                          "Email",
                          `Hello ${m.sender?.name || ""}, I saw your inquiry about ${m.property?.heading || ""}`,
                          m.property?._id
                        )
                      }
                    >
                      <FaEnvelope /> Email
                    </a>
                  </div>
                )}

                {m.moveInDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Move-in: {new Date(m.moveInDate).toLocaleDateString()}
                  </div>
                )}
                {m.property && (
                  <div className="text-xs text-gray-500 mt-1">
                    Property: {m.property.heading} — {m.property.city} — ₹{m.property.rent}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InboxTab;
