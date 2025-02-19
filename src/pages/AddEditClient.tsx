import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function AddEditClient() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams(); // For editing an existing client
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    agent_name: "",
    googleDriveLinks: [],
    websiteUrls: [],
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchClient = async () => {
        const { data: client } = await supabase
          .from("clients")
          .select()
          .eq("id", id)
          .single();
        if (client) {
          setFormData({
            name: client.name,
            agent_name: client.agent_name,
            googleDriveLinks: client.google_drive_links || [],
            websiteUrls: client.website_urls || [],
          });
        }
      };
      fetchClient();
    }
  }, [id, isEditMode]);

  const addOrUpdateClientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (isEditMode) {
        const { data: updatedClient, error } = await supabase
          .from("clients")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return updatedClient;
      } else {
        const { data: newClient, error } = await supabase
          .from("clients")
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return newClient;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: isEditMode ? "Client updated" : "Client added",
        description: "The client data has been saved successfully.",
      });
      navigate("/clients");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save client. Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateClientMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/clients")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
      </Button>

      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? `Edit Client - ${formData.name}` : "Add New Client"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium leading-none">Client Name</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium leading-none">AI Agent Name</label>
          <Input
            required
            value={formData.agent_name}
            onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
          />
        </div>

        {/* Add other fields for Google Drive Links, Website URLs, etc. */}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/clients")}>
            Cancel
          </Button>
          <Button type="submit" disabled={addOrUpdateClientMutation.isLoading}>
            {addOrUpdateClientMutation.isLoading ? "Saving..." : "Save Client"}
          </Button>
        </div>
      </form>
    </div>
  );
}
