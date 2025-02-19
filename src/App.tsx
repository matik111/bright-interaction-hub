import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClientList from "./pages/ClientList";
import AddEditClient from "./pages/AddEditClient";  // Import AddEditClient
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/add" element={<AddEditClient />} /> {/* Add route for Add Client */}
        <Route path="/clients/edit/:id" element={<AddEditClient />} /> {/* Add route for Edit Client */}
        <Route path="/clients/:id" element={<ViewClient />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
