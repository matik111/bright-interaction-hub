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
      setClientName(data.name);
      setFullName(data.full_name || "");
      setEmail(data.email || "");
      setCompany(data.company || "");
      setWebsite(data.website || "");
      setAgentName(data.agent_name || "");
      setDescription(data.description || "");
      setGoogleDriveLinks(data.google_drive_links || []);
      setWebsiteUrls(data.website_urls || []);
    },
  });

  // Mutation for saving the client data
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveClientMutation.mutate();
  };

  // Function to delete a Google Drive link or website URL
  const handleDeleteLink = (url: string, type: 'google' | 'website') => {
    if (type === 'google') {
      setGoogleDriveLinks(googleDriveLinks.filter(link => link !== url));
    } else if (type === 'website') {
      setWebsiteUrls(websiteUrls.filter(link => link !== url));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar"> {/* Sidebar for consistency with dashboard */} </div>

      <div className="main-content">
        <h1 className="page-title">Edit Client</h1>

        <Card className="form-card">
          <CardHeader>
            <h2>Edit Client Information</h2>
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
                />
              </FormItem>

              {/* Company */}
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name"
                />
              </FormItem>

              {/* Website */}
              <FormItem>
                <FormLabel>Website</FormLabel>
                <Input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </FormItem>

              {/* Google Drive Links */}
              <FormItem>
                <FormLabel>Google Drive Links</FormLabel>
                <div>
                  {googleDriveLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="url"
                        value={link}
                        onChange={(e) =>
                          setGoogleDriveLinks(googleDriveLinks.map((l, i) => i === index ? e.target.value : l))
                        }
                        placeholder="Google Drive URL"
                        className="mb-2"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteLink(link, 'google')}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setGoogleDriveLinks([...googleDriveLinks, ""])}
                  >
                    Add Google Drive Link
                  </Button>
                </div>
              </FormItem>

              {/* Website URLs */}
              <FormItem>
                <FormLabel>Website URLs</FormLabel>
                <div>
                  {websiteUrls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) =>
                          setWebsiteUrls(websiteUrls.map((u, i) => i === index ? e.target.value : u))
                        }
                        placeholder="Website URL"
                        className="mb-2"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteLink(url, 'website')}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setWebsiteUrls([...websiteUrls, ""])}
                  >
                    Add Website URL
                  </Button>
                </div>
              </FormItem>

              {/* Description */}
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={4}
                />
              </FormItem>

              {/* Submit Button */}
              <div className="flex justify-between items-center mt-6">
                <Button variant="ghost" onClick={() => navigate("/clients")}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddEditClient;
