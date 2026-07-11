import React, { useState, useEffect } from 'react';

const Reservas = () => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [reservasOcupadas, setReservasOcupadas] = useState([]);

  const horarios = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", 
    "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", 
    "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", 
    "20:00-21:00", "21:00-22:00", "22:00-23:00"
  ];

  useEffect(() => {
    // Aca tenes que usar variables de entorno para el servidor. 
    fetch(`${import.meta.env.VITE_API_URL}/api/reservas`)
      .then(res => res.json())
      .then(data => setReservasOcupadas(data))
      .catch(err => console.error("Error:", err));
  }, []);

  const reservar = async () => {
    // Validación de campos vacíos
    if (!nombre || !telefono || !fecha || !hora) return alert("Completa todos los campos");
    
    // Validación de número de teléfono (solo números, longitud entre 7 y 15)
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!telefonoRegex.test(telefono)) return alert("Por favor ingresa un número de teléfono válido (solo números).");

    const yaOcupado = reservasOcupadas.find(r => r.fecha === fecha && r.hora === hora);
    if (yaOcupado) return alert("¡Ups! Ese horario ya está reservado.");

     // Aca tenes que usar variables de entorno para el servidor. 
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono, fecha, hora })
    });

    if (res.ok) {
      setReservasOcupadas([...reservasOcupadas, { nombre, telefono, fecha, hora }]);
      setNombre(''); setTelefono(''); setFecha(''); setHora('');
      alert('¡Reserva confirmada!');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)]">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Reservar Cancha</h1>
        
        <input 
          className="w-full p-4 mb-4 bg-neutral-950 border border-neutral-800 rounded-2xl outline-none focus:border-green-500 transition-all" 
          placeholder="Tu Nombre" 
          value={nombre}
          onChange={e => setNombre(e.target.value)} 
        />
        
        <input 
          className="w-full p-4 mb-4 bg-neutral-950 border border-neutral-800 rounded-2xl outline-none focus:border-green-500 transition-all" 
          placeholder="Teléfono" 
          type="tel"
          value={telefono}
          onChange={e => setTelefono(e.target.value.replace(/[^0-9]/g, ''))} // Solo permite números mientras escribe
        />

        <input 
          className="w-full p-4 mb-4 bg-neutral-950 border border-neutral-800 rounded-2xl outline-none focus:border-green-500 transition-all" 
          type="date" 
          min={new Date().toISOString().split("T")[0]}
          onChange={e => setFecha(e.target.value)} 
        />

        <div className="grid grid-cols-3 gap-3 mb-8">
          {horarios.map(h => {
            const esOcupado = reservasOcupadas.some(r => r.fecha === fecha && r.hora === h);
            return (
              <button 
                key={h}
                disabled={esOcupado}
                onClick={() => setHora(h)}
                className={`py-2 rounded-xl text-[10px] font-semibold border transition-all 
                  ${hora === h ? 'bg-green-500 border-green-500 text-black' : 
                    esOcupado ? 'bg-neutral-900 border-neutral-800 text-neutral-700 cursor-not-allowed opacity-50' : 
                    'bg-neutral-950 border-neutral-800 hover:border-neutral-600'}`}
              >
                {h}
              </button>
            );
          })}
        </div>

        <button onClick={reservar} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all">
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
};

export default Reservas;