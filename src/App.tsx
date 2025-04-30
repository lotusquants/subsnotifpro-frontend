import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import UserSubscriptions from './pages/UserSubscriptions';
import SubscriptionEvents from './pages/SubscriptionEvents';

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users/:userId/subscriptions" element={<UserSubscriptions />} />
          <Route path="/subscriptions/:subscriptionId/events" element={<SubscriptionEvents />} />
        </Routes>
      </Layout>
    </Router>
    </LocalizationProvider>
  );
};

export default App;