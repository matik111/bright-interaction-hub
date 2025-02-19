// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import ClientList from "./pages/ClientList";
import AddEditClient from "./pages/AddEditClient";
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import AiChatbotAdmin from "./pages/AiChatbotAdmin"; // Correct import
import { Button } from "@/components/ui/button";
import "./App.css";

const queryClient = new QueryClient();

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
          <div className="global-nav" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
            <Link to="/ai-chatbot-admin"> {/* Correct Link */}
              <Button>Go to AI Chatbot Admin System</Button>
            </Link>
          </div>

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/add" element={<AddEditClient />} />
            <Route path="/clients/edit/:id" element={<AddEditClient />} />
            <Route path="/clients/:id" element={<ViewClient />} />
            <Route path="/ai-chatbot-admin" element={<AiChatbotAdmin />} /> {/* Correct Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
