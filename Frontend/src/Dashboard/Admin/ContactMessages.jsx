import React,{useState} from 'react'
import {toast} from "react-hot-toast"
const ContactMessages = () => {
    const [messages, setMessages] = useState([
      { id: 1, name: "Eve", email: "eve@example.com", message: "How can I register?" },
      { id: 2, name: "John", email: "john@example.com", message: "Issue with payment." },
    ]);
  
    const deleteMessage = (id) => {
      setMessages(messages.filter(m => m.id !== id));
      toast.error("Message deleted");
    };
  
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Us Messages</h1>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages available.</p>
        ) : (
          <div className="space-y-4">
            {messages.map(({ id, name, email, message }) => (
              <div key={id} className="p-4 border rounded-lg shadow-md bg-white">
                <h2 className="font-semibold">{name} ({email})</h2>
                <p className="text-gray-700">{message}</p>
                <button onClick={() => deleteMessage(id)} className="text-red-500 mt-2">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default ContactMessages
