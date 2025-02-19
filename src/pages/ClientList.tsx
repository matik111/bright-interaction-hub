import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  Settings, 
  Edit, 
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

type SortField = "name" | "agent_name" | "status" | "updated_at";

export default function ClientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("updated_at");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients", search, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*");

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      }

      const { data, error } = await query.order(sortBy, { ascending: sortBy !== "updated_at" });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <Button onClick={() => navigate("/clients/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortField)}>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Client Name</SelectItem>
            <SelectItem value="agent_name">AI Agent Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="updated_at">Last Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>AI Agent Name</TableHead>
              <TableHead>Google Drive Links</TableHead>
              <TableHead>Website URLs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : clients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link to={`/clients/${client.id}`} className="text-blue-500 hover:underline">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.agent_name}</TableCell>
                  <TableCell>
                    {client.google_drive_links?.length > 0 ? (
                      <ul>
                        {client.google_drive_links.map((link, index) => (
                          <li key={index}>{link}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No links available</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {client.website_urls?.length > 0 ? (
                      <ul>
                        {client.website_urls.map((url, index) => (
                          <li key={index}>{url}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No URLs available</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-muted-foreground">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(client.updated_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => navigate(`/clients/edit/${client.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
