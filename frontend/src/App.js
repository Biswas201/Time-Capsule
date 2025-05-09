import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateMessagePage from './components/CreateMessagePage';
import SentMessagesPage from './components/SentMessagesPage';
import ReceivedMessagesPage from './components/ReceivedMessagesPage';
import MessageDetailPage from './components/MessageDetailPage';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Load user if token exists
  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect root to login if not authenticated, otherwise to sent messages */}
        <Route 
          index 
          element={token ? <Navigate to="/sent" /> : <Navigate to="/login" />} 
        />
        
        {/* Public routes */}
        <Route 
          path="login" 
          element={!token ? <LoginPage /> : <Navigate to="/sent" />} 
        />
        <Route 
          path="register" 
          element={!token ? <RegisterPage /> : <Navigate to="/sent" />} 
        />

        {/* Protected routes */}
        <Route 
          path="profile" 
          element={token ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="create" 
          element={token ? <CreateMessagePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="sent" 
          element={token ? <SentMessagesPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="received" 
          element={token ? <ReceivedMessagesPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="message/:id" 
          element={token ? <MessageDetailPage /> : <Navigate to="/login" />} 
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={token ? "/sent" : "/login"} />} />
      </Route>
    </Routes>
  );
}

export default App;