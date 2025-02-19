import { useState, useEffect } from "react";
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

type SortField = "full_name" | "agent_name" | "status" | "updated_at";

export default function ClientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("updated_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Number of items per page

  // Fetch the clients
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients", search, sortBy, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("id, full_name, email, company, agent_name, status, updated_at, created_at")  // Include timestamp fields
        .ilike("full_name", `%${search}%`)  // Search filter by full_name
        .or(`email.ilike.%${search}%,company.ilike.%${search}%`);  // Search filter by email and company

      query = query.order(sortBy, { ascending: sortBy !== "updated_at" });  // Dynamic sorting

      // Pagination logic
      const { data, error } = await query.range((currentPage - 1) * pageSize, currentPage * pageSize - 1); 
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);  // Update current page for pagination
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
            <SelectItem value="full_name">Full Name</SelectItem>
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
              <TableHead>Full Name</TableHead>
              <TableHead>AI Agent Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
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
                  <TableCell>{client.full_name}</TableCell>
                  <TableCell>{client.agent_name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "active" ? "success" : "destructive"}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(client.updated_at))} ago
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/clients/view/${client.id}`}>
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Link>
                    <Link to={`/clients/edit/${client.id}`}>
                      <Edit className="h-4 w-4 text-green-600" />
                    </Link>
                    <button onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </Button>
          <span>Page {currentPage}</span>
          <Button onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
