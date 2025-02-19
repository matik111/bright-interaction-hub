import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function AddClient() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    agent_name: "",
    description: "",
  });

  const addClientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: client, error } = await supabase
        .from("clients")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Success",
        description: "Client has been added successfully",
      });
      navigate("/clients");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding client:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClientMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/clients")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
      </Button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">Add New Client</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium leading-none">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              required
              className="pl-10"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium leading-none">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              required
              type="email"
              className="pl-10"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="text-sm font-medium leading-none">Company</label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="text-sm font-medium leading-none">Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              className="pl-10"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>
        </div>

        {/* AI Agent Name */}
        <div>
          <label className="text-sm font-medium leading-none">AI Agent Name</label>
          <div className="relative">
            <Bot className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              required
              className="pl-10"
              placeholder="AI Chatbot"
              value={formData.agent_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, agent_name: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium leading-none">Description</label>
          <Textarea
            className="resize-none"
            placeholder="Add a brief description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-6">Add Client</Button>
      </form>
    </div>
  );
}
