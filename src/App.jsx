import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Calendar, 
  MapPin, 
  Play, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Phone, 
  Map as MapIcon, 
  Navigation,
  FileText,
  User
} from 'lucide-react';

const ESQUEMAS_MASTER_SECRET = 'Tk9fTWVfSGFja2VlczIwMjYhQCM=';

// --- PIANO LOADER COMPONENT ---
const PianoLoader = ({ size = 80, showLabel = true }) => {
  const widthVal = size * 1.68;
  return (
    <div className="flex flex-col items-center justify-center p-2 space-y-2 inline-flex">
      <div className="relative" style={{ width: `${widthVal}px`, height: `${size}px` }}>
        <svg viewBox="0 0 84 50" className="w-full h-full">
          {/* Teclas Blancas */}
          <rect x="0" y="0" width="11" height="50" rx="1.5" className="animate-key-1 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="12" y="0" width="11" height="50" rx="1.5" className="animate-key-2 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="24" y="0" width="11" height="50" rx="1.5" className="animate-key-3 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="36" y="0" width="11" height="50" rx="1.5" className="animate-key-4 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="48" y="0" width="11" height="50" rx="1.5" className="animate-key-5 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="60" y="0" width="11" height="50" rx="1.5" className="animate-key-6 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="72" y="0" width="11" height="50" rx="1.5" className="animate-key-7 fill-white stroke-slate-700 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />

          {/* Teclas Negras */}
          <rect x="8" y="0" width="6" height="30" rx="1" className="animate-bkey-1 fill-slate-900 stroke-slate-950 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="20" y="0" width="6" height="30" rx="1" className="animate-bkey-2 fill-slate-900 stroke-slate-950 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="44" y="0" width="6" height="30" rx="1" className="animate-bkey-3 fill-slate-900 stroke-slate-950 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="56" y="0" width="6" height="30" rx="1" className="animate-bkey-4 fill-slate-900 stroke-slate-950 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
          <rect x="68" y="0" width="6" height="30" rx="1" className="animate-bkey-5 fill-slate-900 stroke-slate-950 stroke-[0.5]" style={{ transformBox: 'fill-box' }} />
        </svg>
      </div>
      {showLabel && size >= 30 && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse mt-1">Procesando...</p>}
    </div>
  );
};

// --- BASE COMPONENTS ---
const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden ${onClick ? 'cursor-pointer hover:border-emerald-500 transition-colors' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled, icon: Icon }) => {
  const base = "px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const styles = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    blue: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-950/20",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/20",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800"
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// --- API FETCH HELPER ---
const apiFetch = async (action, payload = {}) => {
  const url = import.meta.env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbwNXxsCfNlOV-JkeUO2Sl55SquzwcrwP50ZpfSUyeg-mI1ugvtCw-1E1mLF-2OS5tmAEw/exec';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ app_secret: ESQUEMAS_MASTER_SECRET, action, payload })
  });
  return response.json();
};

export default function App() {
  const [driverToken, setDriverToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto-login from LocalStorage or URL Token on Mount
  useEffect(() => {
    const savedToken = window.localStorage.getItem('esquemas_driver_token');
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token') || params.get('acceptToken');
    const acceptOnly = params.get('acceptToken');

    const handleAutoInit = async (tokenVal) => {
      setLoading(true);
      setError('');
      try {
        if (acceptOnly) {
          // Accept route first
          const acceptRes = await apiFetch('aceptarRuta', { token: tokenVal });
          if (acceptRes.status === 'success') {
            showToast(`¡Ruta ${tokenVal} Aceptada con Éxito!`);
          }
        }
        
        // Iniciar sesión
        const res = await apiFetch('loginConductor', { token: tokenVal });
        if (res.status === 'success') {
          setCurrentUser(res.user);
          setRouteInfo(res.user.routeInfo || {});
          window.localStorage.setItem('esquemas_driver_token', tokenVal);
          // Clean query string from browser history
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setError(res.message || 'Token inválido o expirado.');
          window.localStorage.removeItem('esquemas_driver_token');
        }
      } catch (err) {
        setError('Error de conexión al cargar la ruta.');
      }
      setLoading(false);
    };

    if (urlToken) {
      handleAutoInit(urlToken.trim().toUpperCase());
    } else if (savedToken) {
      handleAutoInit(savedToken.trim().toUpperCase());
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!driverToken.trim()) return;
    setError('');
    setLoading(true);
    try {
      const formattedToken = driverToken.trim().toUpperCase();
      const res = await apiFetch('loginConductor', { token: formattedToken });
      if (res.status === 'success') {
        setCurrentUser(res.user);
        setRouteInfo(res.user.routeInfo || {});
        window.localStorage.setItem('esquemas_driver_token', formattedToken);
        showToast('Ruta cargada correctamente');
      } else {
        setError(res.message || 'El token ingresado no es válido.');
      }
    } catch (err) {
      setError('Error de red al conectar con el servidor.');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    const tokenVal = window.localStorage.getItem('esquemas_driver_token');
    if (!tokenVal) return;
    setLoading(true);
    try {
      const res = await apiFetch('loginConductor', { token: tokenVal });
      if (res.status === 'success') {
        setRouteInfo(res.user.routeInfo || {});
        showToast('Ruta actualizada');
      } else {
        showToast('Error al refrescar la información.');
      }
    } catch (err) {
      showToast('Error de red al actualizar.');
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    if (!routeInfo || !routeInfo.token) return;
    setLoading(true);
    try {
      const res = await apiFetch('updateTransportStatus', { token: routeInfo.token, newStatus });
      if (res.status === 'success') {
        setRouteInfo(prev => ({ ...prev, status: newStatus }));
        showToast(`Estado actualizado a ${newStatus}`);
        
        let alertText = '';
        if (newStatus === 'COMENZADO') {
          alertText = `🚐 [Logística] El conductor ha comenzado la preparación/ruta "${routeInfo.title}" (Token: ${routeInfo.token}).`;
        } else if (newStatus === 'EN VIAJE') {
          alertText = `🚐 [Logística] El conductor ha iniciado el viaje para la ruta "${routeInfo.title}". ¡En camino!`;
        } else if (newStatus === 'LLEGADO') {
          alertText = `📢 [AVISO LLEGADA] 🚐 ¡El conductor de la ruta "${routeInfo.title}" ha LLEGADO al punto de destino/espera!`;
        } else if (newStatus === 'FINALIZADO') {
          alertText = `🚐 [Logística] La ruta de transporte "${routeInfo.title}" ha finalizado con éxito.`;
        }

        if (alertText && routeInfo.proyectoId) {
          try {
            await apiFetch('sendMensaje', {
              proyectoId: routeInfo.proyectoId,
              sender: '🚐 Conductor',
              role: 'LOGISTICA',
              text: alertText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          } catch(e) {
            console.error("Error al notificar al chat de crew", e);
          }
        }
      } else {
        showToast(`Error: ${res.message}`);
      }
    } catch(e) { 
      showToast("Error al actualizar estado."); 
    }
    setLoading(false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('esquemas_driver_token');
    setCurrentUser(null);
    setRouteInfo(null);
    setDriverToken('');
    setError('');
  };

  // UI rendering
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-900 pb-safe">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[300] bg-emerald-500 text-slate-950 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-fade-in font-bold text-sm">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="text-emerald-500" size={24} />
          <h1 className="text-lg font-black tracking-wider text-white">ESQUEMAS DRIVER</h1>
        </div>
        {currentUser && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleRefresh} disabled={loading} title="Actualizar Ruta" className="p-2 border border-slate-800 rounded-lg">
              <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-500' : 'text-slate-400'} />
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="p-2 border border-slate-800 rounded-lg text-red-400" title="Cerrar Sesión">
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 flex flex-col justify-center">
        
        {loading && !routeInfo && (
          <div className="flex flex-col items-center justify-center p-12">
            <PianoLoader size={80} />
          </div>
        )}

        {!loading && !currentUser && (
          <Card className="p-6 border-slate-800 max-w-md mx-auto w-full animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Truck className="text-emerald-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Acceso Conductor</h2>
              <p className="text-xs text-slate-400">Ingresa el Token de tu Ruta asignada para ver los detalles y mapas de viaje.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Token de Ruta</label>
                <input 
                  type="text" 
                  value={driverToken} 
                  onChange={e => setDriverToken(e.target.value.toUpperCase())} 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-3 text-white text-center font-mono text-xl tracking-widest outline-none transition-colors" 
                  placeholder="TR-XXXX" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full py-3" disabled={loading} icon={Truck}>
                {loading ? 'Verificando...' : 'Iniciar Ruta'}
              </Button>
            </form>
          </Card>
        )}

        {routeInfo && (
          <div className="space-y-4 animate-fade-in w-full">
            <Card className="p-5 border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="flex justify-between items-start mb-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Ruta Asignada</span>
                  <h2 className="text-lg font-black text-white mt-0.5 leading-snug">{routeInfo.title}</h2>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black tracking-wide border ${
                  routeInfo.status === 'PENDING' || routeInfo.status === 'PENDIENTE' ? 'bg-slate-800/80 text-slate-400 border-slate-700' :
                  routeInfo.status === 'COMENZADO' ? 'bg-indigo-950/80 text-indigo-400 border-indigo-900/30' :
                  routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA' ? 'bg-blue-950/80 text-blue-400 border-blue-900/30' :
                  routeInfo.status === 'LLEGADO' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30' :
                  routeInfo.status === 'FINALIZADO' ? 'bg-slate-900/80 text-slate-500 border-slate-850' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {routeInfo.status || 'PENDIENTE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Token</span>
                  <span className="font-mono text-emerald-400 font-bold tracking-widest">{routeInfo.token}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Conductor</span>
                  <span className="text-white font-bold truncate block">{routeInfo.conductor || 'Sin asignar'}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300 text-left">
                <p className="flex items-center gap-2 text-xs text-slate-400"><Calendar size={14} className="text-emerald-500 shrink-0"/> {routeInfo.date} a las {routeInfo.time}</p>

                {/* Timeline map paths */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                  
                  {/* Origen */}
                  <div className="relative pl-6 pb-2">
                    <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-emerald-500/20"></div>
                    <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-slate-950">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Inicio (Origen)</p>
                    <p className="font-bold text-white text-xs leading-snug mt-0.5">{routeInfo.origin}</p>
                    <div className="flex gap-2 mt-1.5">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(routeInfo.origin)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                        <MapIcon size={8}/> Google Maps
                      </a>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(routeInfo.origin)}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                        <Navigation size={8}/> Waze
                      </a>
                    </div>
                  </div>

                  {/* Paradas Intermedias */}
                  {routeInfo.paradas && routeInfo.paradas.length > 0 && routeInfo.paradas.map((stop, sIdx) => (
                    <div key={sIdx} className="relative pl-6 pb-2">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-emerald-500/20"></div>
                      <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center border-2 border-slate-950">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                      </div>
                      <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Parada #{sIdx + 1}</p>
                      <p className="font-bold text-slate-300 text-xs leading-snug mt-0.5">{stop}</p>
                      <div className="flex gap-2 mt-1.5">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                          <MapIcon size={8}/> Google Maps
                        </a>
                        <a href={`https://waze.com/ul?q=${encodeURIComponent(stop)}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                          <Navigation size={8}/> Waze
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* Destino */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-950">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Llegada (Destino)</p>
                    <p className="font-bold text-white text-xs leading-snug mt-0.5">{routeInfo.dest}</p>
                    <div className="flex gap-2 mt-1.5">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(routeInfo.dest)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                        <MapIcon size={8}/> Google Maps
                      </a>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(routeInfo.dest)}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                        <Navigation size={8}/> Waze
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Large Route Navigation maps button */}
              <div className="mt-4">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routeInfo.origin)}&destination=${encodeURIComponent(routeInfo.dest)}&waypoints=${encodeURIComponent((routeInfo.paradas || []).join('|'))}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20"
                >
                  <MapIcon size={14}/> Iniciar Ruta en Google Maps
                </a>
              </div>
            </Card>

            {/* Status Update Actions */}
            <Card className="p-5 border-slate-850 bg-slate-900/50">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block text-center mb-3">Actualizar Estado de Viaje</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button 
                  variant="secondary" 
                  className="w-full py-3" 
                  onClick={() => updateStatus('COMENZADO')} 
                  disabled={loading || routeInfo.status === 'COMENZADO' || routeInfo.status === 'FINALIZADO'}
                  icon={Play}
                >
                  Comenzar Ruta
                </Button>

                <Button 
                  variant="blue" 
                  className="w-full py-3" 
                  onClick={() => updateStatus('EN VIAJE')} 
                  disabled={loading || routeInfo.status === 'EN VIAJE' || routeInfo.status === 'FINALIZADO'}
                  icon={Truck}
                >
                  Iniciar Viaje
                </Button>

                <Button 
                  variant="primary" 
                  className="w-full py-3" 
                  onClick={() => updateStatus('LLEGADO')} 
                  disabled={loading || routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO'}
                  icon={MapPin}
                >
                  ¡Llegué a Destino!
                </Button>

                <Button 
                  variant="danger" 
                  className="w-full py-3" 
                  onClick={() => updateStatus('FINALIZADO')} 
                  disabled={loading || routeInfo.status === 'FINALIZADO'}
                  icon={CheckCircle2}
                >
                  Finalizar Ruta
                </Button>
              </div>
            </Card>
          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer className="text-center p-4 border-t border-slate-900 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
        © 2026 Esquemas Pro Logistics
      </footer>

    </div>
  );
}
