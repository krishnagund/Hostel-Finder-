import { useState } from "react";
import OwnerNavbar from "./OwnerNavbar";
import ListingsTab from "../pages/ListingsTab";
import InboxTab from "../pages/InboxTab";
import FormsTab from "../pages/FormsTab";
import PropertyForm from "../components/PropertyForm"; // You'll create this
import PropertyTypeSelection from "../components/PropertyTypeSelection"; // You'll create this

const HostelOwnerHome = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [lastTabBeforeListing, setLastTabBeforeListing] = useState("listings"); // NEW
  const [showListingForm, setShowListingForm] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null); // "single" or "apartment"

  const handleBackFromListing = () => {
    setShowListingForm(false);
    setSelectedPropertyType(null);
    setActiveTab(lastTabBeforeListing); // Restore previous tab
  };

  const renderTabContent = () => {
    if (showListingForm) {
      if (!selectedPropertyType) {
        return (
          <PropertyTypeSelection setSelectedPropertyType={setSelectedPropertyType} onBack={handleBackFromListing} />
        );
      } else {
        return (
          <PropertyForm propertyType={selectedPropertyType}  onBack={handleBackFromListing} />
        );
      }
    }

    switch (activeTab) {
      case "inbox":
        return <InboxTab />;
      case "forms":
        return <FormsTab />;
      default:
        return <ListingsTab />;
    }
  };

  return (
    <div>
      <OwnerNavbar
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setShowListingForm(false); // Exit listing mode if user switches tab manually
        }}
        activeTab={activeTab}
        setShowListingForm={(val) => {
          if (val) setLastTabBeforeListing(activeTab); // Remember current tab
          setShowListingForm(val);
        }}
        setSelectedPropertyType={setSelectedPropertyType}
      />
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
};

export default HostelOwnerHome;
