import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Reservas from './Login';
import PanelAdmin from './PanelAdmin';

function App() {
  // Verificamos el estado directamente desde localStorage
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('adminAuth') === 'true');

  const handleAuth = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAdmin(true);
  };

  return (
    <Router>
      <Routes>
        {/* Cliente: Siempre en la raíz */}
        <Route path="/" element={<Reservas />} />
        
        {/* Admin: Si no está autenticado, muestra el LoginAdmin, si lo está, muestra el Panel */}
        <Route 
          path="/admin" 
          element={isAdmin ? <PanelAdmin /> : <LoginAdmin onAuth={handleAuth} />} 
        />
        
        {/* Cualquier ruta extra te lleva al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Componente de Login para el Admin

function LoginAdmin({ onAuth }) {
  const [clave, setClave] = useState('');

  const verificar = () => {
    if (clave === "admin123") {
      onAuth();
    } else {
      alert("Clave incorrecta");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      {/* Contenedor con efecto glassmorphism */}
      <div className="w-full max-w-sm bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Panel de Gestión</h2>
          <p className="text-neutral-500 text-sm mt-1">Acceso restringido para administradores</p>
        </div>
        
        <input 
          className="w-full p-4 mb-6 bg-neutral-950 border border-neutral-800 rounded-2xl outline-none focus:border-green-500 text-white transition-all duration-300" 
          type="password" 
          placeholder="Clave de seguridad"
          onChange={(e) => setClave(e.target.value)} 
        />
        
        <button 
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" 
          onClick={verificar}
        >
          Ingresar al Panel
        </button>
      </div>
    </div>
  );
}


export default App;