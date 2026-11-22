import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoomProvider, useRoom } from './context/RoomContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CreateOrJoinRoomModal } from './components/CreateOrJoinRoomModal';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductsPage } from './pages/ProductsPage';
import { RoomPage } from './pages/RoomPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersHistoryPage } from './pages/OrdersHistoryPage';

function AppContent() {
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const { createRoom, joinRoomByCode } = useRoom();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar onOpenRoomModal={() => setRoomModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Routes>
          <Route path="/" element={<HomePage onOpenRoomModal={() => setRoomModalOpen(true)} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/products"
            element={<ProductsPage onOpenRoomModal={() => setRoomModalOpen(true)} />}
          />
          <Route
            path="/room/:roomCode"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-3.5 mt-auto text-center text-xs text-slate-500 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <p>© {new Date().getFullYear()} SyncCart — Collaborative Shopping System.</p>
        </div>
      </footer>

      {/* Global Create / Join Room Modal */}
      <CreateOrJoinRoomModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoomByCode}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoomProvider>
          <AppContent />
        </RoomProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
