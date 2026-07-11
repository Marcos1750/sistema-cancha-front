import React, { useState, useEffect } from 'react';

const PanelAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(''); // Estado para la fecha seleccionada
  const [clave, setClave] = useState('');
  const [autenticado, setAutenticado] = useState(false);

  // Cargar reservas
  useEffect(() => {
    if (autenticado) {
       // Aca tenes que usar variables de entorno para el servidor. 
      fetch(`${import.meta.env.VITE_API_URL}/api/reservas`)
        .then(res => res.json())
        .then(data => setReservas(data))
        .catch(err => console.error("Error:", err));
    }
  }, [autenticado]);

  // Lógica de filtrado
  const reservasFiltradas = filtroFecha 
    ? reservas.filter(r => r.fecha === filtroFecha) 
    : reservas;

  const eliminarReserva = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta reserva?")) return;
     // Aca tenes que usar variables de entorno para el servidor. 
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservas/${id}`, { method: 'DELETE' });
    if (res.ok) setReservas(reservas.filter(r => r.id !== id));
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800 text-center">
          <h2 className="mb-4 text-xl">Acceso Admin</h2>
          <input className="p-3 text-black mb-4 w-full rounded-lg" type="password" placeholder="Clave" onChange={(e) => setClave(e.target.value)} />
          <button className="w-full bg-green-500 py-3 rounded-lg text-black font-bold" onClick={() => clave === "guillecancha1" && setAutenticado(true)}>INGRESAR</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Panel Admin</h1>
          <button onClick={() => window.location.reload()} className="text-sm text-neutral-500 hover:text-white transition">Salir</button>
        </header>

        {/* Filtro elegante */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">Filtrar por fecha</label>
            <input 
              type="date" 
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-2xl outline-none focus:border-green-500 transition"
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>
          <button onClick={() => setFiltroFecha('')} className="mt-6 px-6 py-3 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition text-sm">Limpiar</button>
        </div>

        {/* Lista de reservas */}
        <div className="grid gap-3">
          {reservasFiltradas.map((r, i) => (
            <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl flex justify-between items-center hover:border-neutral-700 transition">
              <div>
                <p className="font-bold text-white">{r.fecha} | {r.hora}</p>
                <p className="text-sm text-neutral-400">{r.nombre} • <span className="text-green-500">{r.telefono}</span></p>
              </div>
              <button 
                onClick={() => eliminarReserva(r.id)} 
                className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanelAdmin;