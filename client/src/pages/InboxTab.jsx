const InboxTab = () => {
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-bold mb-2">Inbox</h2>
      <p>No messages found.</p>
      <small className="text-gray-500">
        Messages older than 6 months are hidden. Check "Show Old Messages" under filters to view them.
      </small>
    </div>
  );
};

export default InboxTab;
