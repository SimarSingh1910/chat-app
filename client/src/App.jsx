import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from '../src/Components/AuthContext';
import ProtectedRoute from '../src/Components/ProtectedRoute';

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/profile' element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
    </Routes>
  </AuthProvider>
);

export default App;