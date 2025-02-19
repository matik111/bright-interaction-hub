
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClientList from "./pages/ClientList";
import AddClient from "./pages/AddClient";
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/add" element={<AddClient />} />
        <Route path="/clients/:id" element={<ViewClient />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
