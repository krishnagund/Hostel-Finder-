const FormsTab = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 bg-gray-50 min-h-screen">
      <div className="p-4 border rounded bg-white">
        <h2 className="text-xl font-bold mb-4">Rental Forms</h2>
        <p className="mb-2">
          Use the following forms to create Residential Tenancy Agreements:
        </p>
        <ul className="list-disc pl-5">
          <li>Fixed Term Tenancy Agreement</li>
          <li>Fixed Term with Option to Convert to Periodic</li>
          <li>Periodic Tenancy Agreement</li>
        </ul>
      </div>
    </div>
  );
};

export default FormsTab;
