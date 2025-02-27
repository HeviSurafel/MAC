import React, { useEffect, useState } from "react";
import ProfileSection from "./ProfileSection";
import PersonalInfoSection from "./PersonalInfoSection";
import AddressSection from "./AddressSection";
import EditModal from "./EditModal";
import { useUserStore } from "../../Store/useAuthStore";
import useStudentStore from "../../Store/student.store";

const Profile = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState("");
  const { user } = useUserStore();
  const { certificate, fetchCertificate } = useStudentStore();

  useEffect(() => {
    fetchCertificate(user.id);
  }, []);

  console.log("User:", user);
  console.log("Certificate URL:", certificate);

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
              <ProfileSection />
              <PersonalInfoSection />
              <AddressSection onEdit={() => handleEdit("address")} />
              {isModalOpen && (
                <EditModal
                  section={sectionToEdit}
                  user={user}
                  closeModal={closeModal}
                />
              )}

              {/* ✅ Fix: Display PDF certificate correctly */}
              {certificate && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    My Certificate
                  </h3>
                  <iframe
                    src={certificate}
                    title="Certificate"
                    className="w-full h-96 border rounded-lg shadow-md"
                  ></iframe>

                  {/* Download Button */}
                  <a
                    href={certificate}
                    download="certificate.pdf"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                  >
                    Download Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
