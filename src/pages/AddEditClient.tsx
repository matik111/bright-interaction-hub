import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardBody } from "@/components/ui/card"; 
import { Form, FormItem, FormLabel } from "@/components/ui/form"; 

const AddEditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State variables for form data
  const [clientName, setClientName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [googleDriveLinksAddedAt, setGoogleDriveLinksAddedAt] = useState<string[]>([]);
  const [websiteUrls, setWebsiteUrls] = useState<string[]>([]);

  // Fetch client data if editing
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (id) {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        return data;
      }
    },
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setClientName(data.name || "");
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setCompany(data.company || "");
        setWebsite(data.website || "");
        setAgentName(data.agent_name || "");
        setDescription(data.description || "");
        setGoogleDriveLinksAddedAt(data.google_drive_links_added_at || []);
        setWebsiteUrls(data.website_urls || []);
      }
    },
  });

  // Mutation for saving the client data (adding or editing)
  const saveClientMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: clientName,
        full_name: fullName,
        email: email,
        company: company,
        website: website,
        agent_name: agentName,
        description: description,
        google_drive_links_added_at: googleDriveLinksAddedAt, // Saving the timestamp
        website_urls: websiteUrls,
        updated_at: new Date().toISOString(), // Always update the `updated_at` field
      };

      // Only add created_at on a new client (if id does not exist)
      if (!id) {
        payload["created_at"] = new Date().toISOString();
      }

      // Perform upsert operation, updating or inserting data based on client ID
      const { data, error } = await supabase.from("clients").upsert(payload, { onConflict: ['id'] });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      navigate("/clients"); // Redirect to client list page after saving
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveClientMutation.mutate();
  };

  // Handle delete link (Google Drive or Website URLs)
  const handleDeleteLink = (url: string, type: 'google' | 'website') => {
    if (type === 'google') {
      setGoogleDriveLinksAddedAt(googleDriveLinksAddedAt.filter(link => link !== url));
    } else if (type === 'website') {
      setWebsiteUrls(websiteUrls.filter(link => link !== url));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar"> {/* Sidebar for consistency with dashboard */} </div>

      <div className="main-content">
        <h1 className="page-title">{id ? "Edit Client" : "Add New Client"}</h1>

        <Card className="form-card">
          <CardHeader>
            <h2>{id ? "Edit Client Information" : "Add Client Information"}</h2>
          </CardHeader>

          <CardBody>
            <Form onSubmit={handleSubmit} className="client-form">
              {/* Client Name */}
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <Input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  required
                />
              </FormItem>

              {/* Full Name */}
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </FormItem>

              {/* Email */}
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </FormItem>

              {/* Company */}
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company"
                />
              </FormItem>

              {/* Website */}
              <FormItem>
                <FormLabel>Website</FormLabel>
                <Input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Enter website"
                />
              </FormItem>

              {/* AI Agent Name */}
              <FormItem>
                <FormLabel>AI Agent Name</FormLabel>
                <Input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter AI Agent Name"
                />
              </FormItem>

              {/* Description */}
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </FormItem>

              {/* Submit Button */}
              <Button type="submit">
                {id ? "Save Changes" : "Add Client"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddEditClient;
