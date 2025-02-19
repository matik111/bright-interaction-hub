import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient
import Index from "./pages/Index";
import ClientList from "./pages/ClientList";
import AddEditClient from "./pages/AddEditClient"; // Import AddEditClient
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import "./App.css";

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Ensure the entire app is wrapped */}
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/add" element={<AddEditClient />} /> {/* Route for Add Client */}
          <Route path="/clients/edit/:id" element={<AddEditClient />} /> {/* Route for Edit Client */}
          <Route path="/clients/:id" element={<ViewClient />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider> {/* Close QueryClientProvider here */}
  );
}

export default App;
