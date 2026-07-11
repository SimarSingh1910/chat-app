import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider } from '../src/Components/AuthContext';
import { SocketProvider } from '../src/Components/SocketContext';
import { ChatProvider } from '../src/Components/ChatContext';
import { FriendsProvider } from '../src/Components/FriendsContext';
import ProtectedRoute from '../src/Components/ProtectedRoute';

const App = () => (
  <AuthProvider>
    <SocketProvider>
      <ChatProvider>
        <FriendsProvider>
          <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          </Routes>
        </FriendsProvider>
      </ChatProvider>
    </SocketProvider>
  </AuthProvider>
);

export default App;