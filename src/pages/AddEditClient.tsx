import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const AddEditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [googleDriveLinks, setGoogleDriveLinks] = useState<string[]>([]);
  const [websiteUrls, setWebsiteUrls] = useState<string[]>([]);

  // Fetch client data if editing
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],  // Use an array for queryKey
    queryFn: async () => {
      if (id) {
        const { data, error } = await supabase.from("clients").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
      }
    },
    enabled: !!id,  // Only fetch when there's an id
    onSuccess: (data) => {
      setClientName(data.name);
      setAgentName(data.agent_name);
      setGoogleDriveLinks(data.google_drive_links || []);
      setWebsiteUrls(data.website_urls || []);
    },
  });

  // Mutation for saving the client data
  const saveClientMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: clientName,
        agent_name: agentName,
        google_drive_links: googleDriveLinks,
        website_urls: websiteUrls,
        updated_at: new Date().toISOString(),  // Update the updated_at timestamp
        // created_at will automatically be set if it's a new entry
      };
      const { data, error } = await supabase.from("clients").upsert(payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      navigate("/clients");
    },
  });

  const handleAddGoogleDriveLink = () => {
    setGoogleDriveLinks((prev) => [...prev, ""]);
  };

  const handleRemoveGoogleDriveLink = (index: number) => {
    setGoogleDriveLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddWebsiteUrl = () => {
    setWebsiteUrls((prev) => [...prev, ""]);
  };

  const handleRemoveWebsiteUrl = (index: number) => {
    setWebsiteUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    saveClientMutation.mutate();
  };

  const handleCancel = () => {
    navigate("/clients");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold">{id ? `Edit Client - ${clientName}` : "Add New Client"}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Client Name Field */}
        <div className="mb-4">
          <label htmlFor="clientName" className="block font-medium">Client Name</label>
          <input
            id="clientName"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* AI Agent Name Field */}
        <div className="mb-4">
          <label htmlFor="agentName" className="block font-medium">AI Agent Name</label>
          <input
            id="agentName"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Google Drive Links Section */}
        <div className="mb-6">
          <label className="block font-medium">Google Drive Share Links</label>
          {googleDriveLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={link}
                onChange={(e) => {
                  const newLinks = [...googleDriveLinks];
                  newLinks[index] = e.target.value;
                  setGoogleDriveLinks(newLinks);
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveGoogleDriveLink(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <Button onClick={handleAddGoogleDriveLink}>Add Google Drive Link</Button>
        </div>

        {/* Website URLs Section */}
        <div className="mb-6">
          <label className="block font-medium">Website URLs</label>
          {websiteUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const newUrls = [...websiteUrls];
                  newUrls[index] = e.target.value;
                  setWebsiteUrls(newUrls);
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveWebsiteUrl(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <Button onClick={handleAddWebsiteUrl}>Add Website URL</Button>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel} variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditClient;
