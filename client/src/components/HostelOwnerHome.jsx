import { useState, useEffect, useContext } from "react";
import OwnerNavbar from "./OwnerNavbar";
import ListingsTab from "../pages/ListingsTab";
import InboxTab from "../pages/InboxTab";
import FormsTab from "../pages/FormsTab";
import PropertyForm from "./PropertyForm"; 
import PropertyTypeSelection from "./PropertyTypeSelection"; 
import { AppContext } from "../context/Appcontext";
import RenterInfo from "./RenterInfo";
import TourTrigger from "./TourTrigger";

const HostelOwnerHome = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [lastTabBeforeListing, setLastTabBeforeListing] = useState("listings"); 
  const [showListingForm, setShowListingForm] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null); 
  const [properties, setProperties] = useState([]);
  const [editProperty, setEditProperty] = useState(null);
  const { backendurl } = useContext(AppContext);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${backendurl}/api/property/my-properties`, {
        credentials: "include",
      });
      const data = await response.json();
      setProperties(data.properties);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleBackFromListing = () => {
    setShowListingForm(false);
    setSelectedPropertyType(null);
    setEditProperty(null);
    setActiveTab(lastTabBeforeListing);
    fetchProperties();
  };

  const handleEditProperty = (property) => {
    setEditProperty(property);
    setSelectedPropertyType("single");
    setShowListingForm(true);
  };

  const renderTabContent = () => {
    if (showListingForm) {
      if (!selectedPropertyType) {
        return (
          <PropertyTypeSelection
            setSelectedPropertyType={setSelectedPropertyType}
            onBack={handleBackFromListing}
          />
        );
      } else {
        return (
          <PropertyForm
            propertyType={selectedPropertyType}
            onBack={handleBackFromListing}
            editProperty={editProperty}
          />
        );
      }
    }

    switch (activeTab) {
      case "inbox":
        return <InboxTab />;
      case "forms":
        return <FormsTab />;
      default:
        return <ListingsTab properties={properties} onPropertyUpdate={fetchProperties} onEditProperty={handleEditProperty} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      {/* Tour Trigger Button - Fixed Position for existing users */}
      <div className="fixed bottom-4 right-4 z-40">
        <TourTrigger tourName="ownerDashboard" variant="icon" />
      </div>
      <div className="max-w-7xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HostelOwnerHome;
