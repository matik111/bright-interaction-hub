import React from "react"; // <-- Ensure this is included
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient
import Index from "./pages/Index";
import ClientList from "./pages/ClientList";
import AddEditClient from "./pages/AddEditClient"; // Import AddEditClient
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import AiChatbotAdmin from "./pages/AiChatbotAdmin"; // Import the AI Chatbot Admin Page
import { Button } from "@/components/ui/button"; // Assuming you're using a Button component
import "./App.css";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Error Boundary to catch any rendering errors in components
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try refreshing the page.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          {/* Global Navigation Button */}
          <div className="global-nav" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
            <Link to="/ai-chatbot-admin">
              <Button>Go to AI Chatbot Admin System</Button>
            </Link>
          </div>

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/add" element={<AddEditClient />} /> {/* Route for Add Client */}
            <Route path="/clients/edit/:id" element={<AddEditClient />} /> {/* Route for Edit Client */}
            <Route path="/clients/:id" element={<ViewClient />} />
            <Route path="/ai-chatbot-admin" element={<AiChatbotAdmin />} /> {/* Route for AI Chatbot Admin System */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
