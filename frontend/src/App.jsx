import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast, { useToast } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import Architecture from './pages/Architecture';
import { getNotifications } from './services/api';
import './index.css';

function App() {
  const { toasts, addToast, removeToast } = useToast();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => {}); // silently fail if notification service is down
  }, []);

  // Poll notifications every 5 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleOrderPlaced = () => {
    // Fetch notifications after a short delay to let Kafka deliver
    setTimeout(fetchNotifications, 2000);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar notificationCount={notifications.length} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard notifications={notifications} />} />
            <Route path="/inventory" element={<Inventory addToast={addToast} />} />
            <Route path="/orders" element={<Orders addToast={addToast} onOrderPlaced={handleOrderPlaced} />} />
            <Route path="/notifications" element={<Notifications notifications={notifications} />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </main>
        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;
