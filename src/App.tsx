import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient
import Index from "./pages/Index";
import ClientList from "./pages/ClientList";
import AddClient from "./pages/AddClient";
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import "./App.css";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    // Wrap the entire app with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/:id" element={<ViewClient />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
