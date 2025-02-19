import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const AddEditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [googleDriveLinks, setGoogleDriveLinks] = useState<string[]>([]);
  const [websiteUrls, setWebsiteUrls] = useState<string[]>([]);

  // Fetch client data if editing
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (id) {
        const { data, error } = await supabase.from("clients").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
      }
    },
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setClientName(data.name);
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setCompany(data.company || "");
        setWebsite(data.website || "");
        setAgentName(data.agent_name || "");
        setDescription(data.description || "");
        setGoogleDriveLinks(data.google_drive_links || []);
        setWebsiteUrls(data.website_urls || []);
      }
    },
  });

  // Mutation for saving the client data (update or add)
  const saveClientMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: clientName,
        full_name: fullName,  // Saving Full Name
        email: email,          // Saving Email
        company: company,      // Saving Company
        website: website,      // Saving Website
        agent_name: agentName, // Saving AI Agent Name
        description: description,  // Saving Description
        google_drive_links: googleDriveLinks,
        website_urls: websiteUrls,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from("clients").upsert(payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      navigate("/clients");
    },
  });

  // Mutation for deleting the client data
  const deleteClientMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      return;
    },
    onSuccess: () => {
      navigate("/clients"); // Redirect after successful deletion
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClientMutation.mutate();
    }
  };

  const handleAddGoogleDriveLink = () => {
    setGoogleDriveLinks((prev) => [...prev, ""]);
  };

  const handleAddWebsiteUrl = () => {
    setWebsiteUrls((prev) => [...prev, ""]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveClientMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{id ? "Edit Client" : "Add Client"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label>Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div>
          <label>Agent Name</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Google Drive Links</label>
          <button type="button" onClick={handleAddGoogleDriveLink}>
            Add Google Drive Link
          </button>
          {googleDriveLinks.map((link, index) => (
            <input
              key={index}
              type="text"
              value={link}
              onChange={(e) =>
                setGoogleDriveLinks((prev) =>
                  prev.map((l, i) => (i === index ? e.target.value : l))
                )
              }
            />
          ))}
        </div>

        <div>
          <label>Website URLs</label>
          <button type="button" onClick={handleAddWebsiteUrl}>
            Add Website URL
          </button>
          {websiteUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              value={url}
              onChange={(e) =>
                setWebsiteUrls((prev) =>
                  prev.map((u, i) => (i === index ? e.target.value : u))
                )
              }
            />
          ))}
        </div>

        <div className="actions">
          <Button type="submit">
            {id ? "Update Client" : "Add Client"}
          </Button>
          {id && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="destructive"
            >
              Delete Client
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditClient;
