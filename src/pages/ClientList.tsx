import React, { useState } from 'react';

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Client Name');

  const clients = [
    // Sample data for illustration
    { clientName: 'Client A', aiAgentName: 'Agent 1', status: 'Active', lastUpdated: '2025-02-18' },
    { clientName: 'Client B', aiAgentName: 'Agent 2', status: 'Inactive', lastUpdated: '2025-02-17' },
    // Add more clients as needed
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const filteredClients = clients.filter(client =>
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClients = filteredClients.sort((a, b) => {
    if (sortOption === 'Client Name') {
      return a.clientName.localeCompare(b.clientName);
    } else if (sortOption === 'AI Agent Name') {
      return a.aiAgentName.localeCompare(b.aiAgentName);
    } else if (sortOption === 'Status') {
      return a.status.localeCompare(b.status);
    } else if (sortOption === 'Last Updated') {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    }
    return 0;
  });

  return (
    <div>
      <h1>Client Management</h1>
      <div>
        <input
          type="text"
          placeholder="Search Clients..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={sortOption} onChange={handleSortChange}>
          <option value="Client Name">Client Name</option>
          <option value="AI Agent Name">AI Agent Name</option>
          <option value="Status">Status</option>
          <option value="Last Updated">Last Updated</option>
        </select>
        <button>+ Add New Client</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>AI Agent Name</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client, index) => (
            <tr key={index}>
              <td>{client.clientName}</td>
              <td>{client.aiAgentName}</td>
              <td>{client.status}</td>
              <td>{client.lastUpdated}</td>
              <td>
                <button>View</button>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls can be added here */}
    </div>
  );
};

export default ClientList;
