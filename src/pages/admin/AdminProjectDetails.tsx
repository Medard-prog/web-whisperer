
import React from 'react';
import { useParams } from 'react-router-dom';

export default function AdminProjectDetails() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Admin Project Details</h1>
      <p>Admin view for project ID: {id}</p>
    </div>
  );
}
