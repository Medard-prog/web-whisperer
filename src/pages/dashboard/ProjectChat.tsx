
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectChat() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  
  const sendMessage = () => {
    console.log(`Sending message for project: ${id}`);
    // Implement message sending logic here
  };
  
  return (
    <div>
      <h1>Project Chat</h1>
      <p>Chat for project ID: {id}</p>
      <div className="mt-4">
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Type your message here..."
        />
        <button 
          onClick={sendMessage}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
