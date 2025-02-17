import React, { useState } from "react";
import ProfileSection from "./ProfileSection";
import PersonalInfoSection from "./PersonalInfoSection";
import AddressSection from "./AddressSection";
import EditModal from "./EditModal";

const Profile = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState("");

  const handleEdit = (section) => {
    setSectionToEdit(section);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 p-6 rounded-xl">
      <div className="flex flex-col gap-6">
        {/* Full-width Profile Section */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">
                My Profile
              </h2>
              {/* Profile, Personal Info, and Address Sections */}
              <ProfileSection onEdit={() => handleEdit("profile")} />
              <PersonalInfoSection onEdit={() => handleEdit("personal")} />
              <AddressSection onEdit={() => handleEdit("address")} />
              
              {/* Modal for editing sections */}
              {isModalOpen && (
                <EditModal section={sectionToEdit} closeModal={closeModal} />
              )}
            </div>
          </div>
        </div>
        
        {/* Add any additional sections or information you want to display here */}
        
      </div>
    </div>
  );
};

export default Profile;
