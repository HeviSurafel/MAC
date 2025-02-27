import React,{useEffect, useState} from 'react'
import {toast} from "react-hot-toast"
import {useUserStore} from "../../Store/useAuthStore"
const ContactMessages = () => {
  const {contacts,getContactUs,deleteContactUs}=useUserStore();
  useEffect(()=>{
    getContactUs();
  },[])
    const deleteMessage = (id) => {
      deleteContactUs(id);
      toast.error("Message deleted");
    };  
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Us Messages</h1>
        {contacts?.length === 0 ? (
          <p className="text-gray-500">No messages available.</p>
        ) : (
          <div className="space-y-4">
            {contacts?.map(({ _id, name, email, message }) => (
              <div key={_id} className="p-4 border rounded-lg shadow-md bg-white">
                <h2 className="font-semibold">{name} ({email})</h2>
                <p className="text-gray-700">{message}</p>
                <p>{_id}</p>
                <button onClick={() => deleteMessage(_id)} className="text-red-500 mt-2">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default ContactMessages
