import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaCog } from 'react-icons/fa';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Client Name');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleDeleteClient = async (id: number) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting client:', error);
    } else {
      fetchClients();
    }
  };

  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClients = filteredClients.sort((a, b) => {
    if (sortOption === 'Client Name') {
      return a.client_name.localeCompare(b.client_name);
    } else if (sortOption === 'AI Agent Name') {
      return a.ai_agent_name.localeCompare(b.ai_agent_name);
    } else if (sortOption === 'Status') {
      return a.status.localeCompare(b.status);
    } else if (sortOption === 'Last Updated') {
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
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
        <Link to="/add-edit-client">
          <button>+ Add New Client</button>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>AI Agent Name</th>
            <th>Website URLs</th>
            <th>Google Drive URLs</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client, index) => (
            <tr key={index}>
              <td>{client.client_name}</td>
              <td>{client.email}</td>
              <td>{client.company}</td>
              <td>{client.ai_agent_name}</td>
              <td>{client.website_urls}</td>
              <td>{client.google_drive_urls}</td>
              <td>{client.status}</td>
              <td>{client.last_updated}</td>
              <td>
                <Link to={`/view-client/${client.id}`}>
                  <FaEye />
                </Link>
                <Link to={`/add-edit-client/${client.id}`}>
                  <FaEdit />
                </Link>
                <FaTrash onClick={() => handleDeleteClient(client.id)} />
                <FaCog />
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
