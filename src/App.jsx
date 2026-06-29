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

// --- TOKEN SANITIZER HELPER ---
const sanitizeTokenInput = (val) => {
  if (!val) return '';
  // Remove all spaces and non-alphanumeric/non-hyphen characters
  let cleaned = val.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
  // If they typed TR followed by digits directly without hyphen, e.g. TR4802 -> TR-4802
  if (/^TR\d+$/.test(cleaned)) {
    cleaned = 'TR-' + cleaned.slice(2);
  }
  return cleaned;
};

// --- DATE FORMATTER HELPER ---
const formatDateString = (dateStr) => {
  if (!dateStr) return '';
  let str = String(dateStr).trim();
  let clean = str.replace(/-/g, '/');
  const parts = clean.split('/');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return clean;
};

export default function App() {
  const [driverToken, setDriverToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Real-time navigation GPS states
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapOrigin, setMapOrigin] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Watch driver's real-time position
  useEffect(() => {
    if (!routeInfo) return;
    if (!navigator.geolocation) {
      console.warn("Este navegador no soporta geolocalización.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speed = position.coords.speed ? Math.round(position.coords.speed * 3.6) : 0;
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed,
          accuracy: Math.round(position.coords.accuracy)
        });
      },
      (err) => {
        console.error("Error al obtener GPS: ", err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [routeInfo]);

  // Synchronize map origin when routeInfo changes
  useEffect(() => {
    if (routeInfo && routeInfo.origin) {
      setMapOrigin(routeInfo.origin);
    }
  }, [routeInfo]);

  const handleRecalculateFromGPS = () => {
    if (currentLocation) {
      setMapOrigin(`${currentLocation.lat},${currentLocation.lng}`);
      showToast("Ruta recalculada desde tu ubicación GPS actual");
    } else {
      showToast("Esperando señal GPS...");
    }
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
        const sanitized = sanitizeTokenInput(tokenVal);
        if (acceptOnly) {
          // Accept route first
          const acceptRes = await apiFetch('aceptarRuta', { token: sanitized });
          if (acceptRes.status === 'success') {
            showToast(`¡Ruta ${sanitized} Aceptada con Éxito!`);
          }
        }
        
        // Iniciar sesión
        const res = await apiFetch('loginConductor', { token: sanitized });
        if (res.status === 'success') {
          setCurrentUser(res.user);
          setRouteInfo(res.user.routeInfo || {});
          window.localStorage.setItem('esquemas_driver_token', sanitized);
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
      handleAutoInit(urlToken);
    } else if (savedToken) {
      handleAutoInit(savedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formattedToken = sanitizeTokenInput(driverToken);
    if (!formattedToken) return;
    setError('');
    setLoading(true);
    try {
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
      const coordsVal = currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : null;
      const res = await apiFetch('updateTransportStatus', { 
        token: routeInfo.token, 
        newStatus,
        coords: coordsVal 
      });
      if (res.status === 'success') {
        setRouteInfo(prev => ({ ...prev, status: newStatus }));
        showToast(`Estado actualizado a ${newStatus}`);
        
        let alertText = '';
        const gpsLink = currentLocation 
          ? `\n📍 Ubicación GPS: https://www.google.com/maps/search/?api=1&query=${currentLocation.lat},${currentLocation.lng}` 
          : '';

        if (newStatus === 'COMENZADO') {
          alertText = `🚐 [Logística] El conductor ha comenzado la preparación/ruta "${routeInfo.title}" (Token: ${routeInfo.token}).${gpsLink}`;
        } else if (newStatus === 'EN VIAJE') {
          alertText = `🚐 [Logística] El conductor ha iniciado el viaje para la ruta "${routeInfo.title}". ¡En camino!${gpsLink}`;
        } else if (newStatus === 'LLEGADO') {
          alertText = `📢 [AVISO LLEGADA] 🚐 ¡El conductor de la ruta "${routeInfo.title}" ha LLEGADO al punto de destino/espera!${gpsLink}`;
        } else if (newStatus === 'FINALIZADO') {
          alertText = `🚐 [Logística] La ruta de transporte "${routeInfo.title}" ha finalizado con éxito.${gpsLink}`;
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
    const activeToken = routeInfo ? routeInfo.token : window.localStorage.getItem('esquemas_driver_token') || '';
    const confirmLogout = window.confirm(
      `⚠️ ¿Estás seguro de que deseas salir?\n\nAl cerrar la sesión perderás el acceso a esta pantalla de viaje. Para volver a ingresar deberás ingresar el Token de la Ruta (${activeToken}). Asegúrate de tenerlo copiado o guardado antes de continuar.`
    );
    
    if (confirmLogout) {
      window.localStorage.removeItem('esquemas_driver_token');
      setCurrentUser(null);
      setRouteInfo(null);
      setDriverToken('');
      setError('');
    }
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

      {routeInfo && (
        <div className="max-w-lg w-full mx-auto px-4 mt-3 animate-fade-in">
          {/* 1. Cabecera Ultra-Compacta (Ruta, Token, Conductor, Estado y Horarios) */}
          <Card className="py-2.5 px-3 border-slate-850 bg-slate-900/60 text-xs">
            <div className="flex flex-col gap-1.5">
              {/* Primera Fila: Título de la Ruta y Estado */}
              <div className="flex justify-between items-center gap-2">
                <div className="truncate flex-1 min-w-0">
                  <span className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-wider mr-1">[Ruta]</span>
                  <span className="font-black text-white text-sm tracking-wide">{routeInfo.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide border shrink-0 ${
                  routeInfo.status === 'PENDING' || routeInfo.status === 'PENDIENTE' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                  routeInfo.status === 'COMENZADO' ? 'bg-indigo-950/80 text-indigo-400 border-indigo-900/30' :
                  routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA' ? 'bg-blue-950/80 text-blue-400 border-blue-900/30 animate-pulse' :
                  routeInfo.status === 'LLEGADO' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30' :
                  routeInfo.status === 'FINALIZADO' ? 'bg-slate-900/80 text-slate-500 border-slate-850' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {routeInfo.status || 'PENDIENTE'}
                </span>
              </div>

              {/* Segunda Fila: Datos Principales (Token y Conductor) */}
              <div className="flex items-center gap-3 text-[10px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                <div>
                  <span className="text-slate-500 font-bold uppercase mr-1">Token:</span>
                  <span className="font-mono text-emerald-400 font-bold tracking-wider">{routeInfo.token}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                <div className="truncate flex-1 min-w-0">
                  <span className="text-slate-500 font-bold uppercase mr-1">Conductor:</span>
                  <span className="text-slate-200 font-bold">
                    {routeInfo.conductor ? routeInfo.conductor.split(' (')[0] : 'Sin asignar'}
                  </span>
                </div>
              </div>

              {/* Tercera Fila: Fecha y Hora de Llegada / Destino */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[9px] text-slate-500 border-t border-slate-850/20 pt-1 gap-y-1">
                <div className="flex flex-wrap gap-2 items-center">
                  <div>
                    <span className="font-bold uppercase mr-1">Fecha:</span>
                    <span className="text-slate-400 font-medium">{formatDateString(routeInfo.date)}</span>
                  </div>
                  <div className="w-0.5 h-2.5 bg-slate-800"></div>
                  <div>
                    <span className="font-bold uppercase mr-1">Hora Llegada:</span>
                    <span className="text-slate-400 font-medium">{routeInfo.time}</span>
                  </div>
                </div>
                <div className="truncate flex-1 min-w-0 text-left sm:text-right">
                  <span className="font-bold uppercase mr-1">Destino:</span>
                  <span className="text-slate-400 font-medium truncate inline-block w-full sm:w-auto" title={routeInfo.dest}>{routeInfo.dest}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

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
                  onBlur={e => setDriverToken(sanitizeTokenInput(e.target.value))}
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
            
            {/* 2. Mapa de Navegación Integrado con Rastreo GPS */}
            <Card className="overflow-hidden border-slate-800 bg-slate-900/50">
              <div className="p-3 bg-slate-900 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapIcon className="text-emerald-500 animate-pulse" size={18} />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Navegación de Ruta en Vivo</span>
                </div>
                <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                  Ruta en Vivo
                </span>
              </div>

              {/* GPS Telemetry Dashboard */}
              <div className="bg-slate-950 px-3 py-2 border-b border-slate-850 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentLocation ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'}`}></div>
                  <span className="font-semibold text-slate-400">
                    {currentLocation ? `GPS (±${currentLocation.accuracy}m)` : 'GPS buscando...'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentLocation && (
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30">
                      ⚡ {currentLocation.speed} km/h
                    </span>
                  )}
                  {currentLocation && (
                    <button
                      onClick={handleRecalculateFromGPS}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-slate-750 text-[10px] flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      <Navigation size={10} className="rotate-45" /> Recalcular
                    </button>
                  )}
                </div>
              </div>

              <div className="relative w-full aspect-video sm:h-[350px] bg-slate-950">
                <iframe
                  title="Navegación de Ruta"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, minHeight: '300px' }}
                  src={`https://maps.google.com/maps?saddr=${encodeURIComponent(mapOrigin || routeInfo.origin)}&daddr=${[...(routeInfo.paradas || []), routeInfo.dest].map(stop => encodeURIComponent(stop)).join('+to:')}&output=embed`}
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              {/* Botones de Google Maps y Waze directamente después del mapa */}
              <div className="p-2.5 bg-slate-900/30 flex justify-between items-center gap-2 border-t border-slate-850">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Indicaciones por voz:
                </span>
                <div className="flex gap-2">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routeInfo.origin)}&destination=${encodeURIComponent(routeInfo.dest)}&waypoints=${encodeURIComponent((routeInfo.paradas || []).join('|'))}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] bg-slate-850 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-750 transition-colors"
                  >
                    Google Maps
                  </a>
                  <a 
                    href={`https://waze.com/ul?q=${encodeURIComponent(routeInfo.dest)}&navigate=yes`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] bg-slate-850 hover:bg-slate-800 text-blue-400 px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-750 transition-colors"
                  >
                    Waze
                  </a>
                </div>
              </div>
            </Card>

            {/* 3. Acciones de Actualización de Estado (Botones) */}
            <Card className="p-5 border-slate-850 bg-slate-900/50">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block text-center mb-4">Actualizar Estado de Viaje</span>
              
              <div className="flex flex-col gap-3.5">
                {/* 1. Iniciar Viaje */}
                <button 
                  onClick={() => updateStatus('EN VIAJE')}
                  disabled={loading || routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA' || routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO'}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 
                    ${(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA' || routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO') 
                      ? 'bg-slate-950/30 text-slate-500 border-slate-900 opacity-40 cursor-not-allowed scale-100' 
                      : 'bg-blue-600/10 hover:bg-blue-600/15 border-blue-500/20 active:scale-[0.98] cursor-pointer text-blue-400'
                    }
                    ${(!routeInfo.status || routeInfo.status === 'PENDIENTE' || routeInfo.status === 'PENDING' || routeInfo.status === 'COMENZADO') && !loading
                      ? 'ring-2 ring-blue-500/40 animate-pulse-slow bg-blue-600 text-slate-950 font-black hover:bg-blue-500 border-blue-400' 
                      : ''
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0
                      ${(!routeInfo.status || routeInfo.status === 'PENDIENTE' || routeInfo.status === 'PENDING' || routeInfo.status === 'COMENZADO') && !loading
                        ? 'bg-slate-950 text-blue-400' 
                        : 'bg-slate-850 text-slate-400'
                      }`}
                    >
                      1
                    </div>
                    <div>
                      <h3 className={`font-black text-sm md:text-base tracking-wide uppercase leading-tight
                        ${(!routeInfo.status || routeInfo.status === 'PENDIENTE' || routeInfo.status === 'PENDING' || routeInfo.status === 'COMENZADO') && !loading
                          ? 'text-slate-950' 
                          : (routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA' || routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO' ? 'text-slate-500' : 'text-blue-400')
                        }`}
                      >
                        Iniciar Viaje
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5
                        ${(!routeInfo.status || routeInfo.status === 'PENDIENTE' || routeInfo.status === 'PENDING' || routeInfo.status === 'COMENZADO') && !loading
                          ? 'text-slate-950/70' 
                          : 'text-slate-500'
                        }`}
                      >
                        {(!routeInfo.status || routeInfo.status === 'PENDIENTE' || routeInfo.status === 'PENDING' || routeInfo.status === 'COMENZADO') ? 'Siguiente paso recomendado' : 'Comenzado'}
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg shrink-0
                    ${(!routeInfo.status || routeInfo.status === 'PENDIENTE' || routeInfo.status === 'PENDING' || routeInfo.status === 'COMENZADO') && !loading
                      ? 'bg-slate-950/10 text-slate-950' 
                      : 'bg-slate-850/50 text-slate-400'
                    }`}
                  >
                    <Truck size={20} />
                  </div>
                </button>

                {/* 2. Llegué a Destino */}
                <button 
                  onClick={() => updateStatus('LLEGADO')}
                  disabled={loading || routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO'}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 
                    ${(routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO') 
                      ? 'bg-slate-950/30 text-slate-500 border-slate-900 opacity-40 cursor-not-allowed scale-100' 
                      : 'bg-emerald-600/10 hover:bg-emerald-600/15 border-emerald-500/20 active:scale-[0.98] cursor-pointer text-emerald-400'
                    }
                    ${(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA') && !loading
                      ? 'ring-2 ring-emerald-500/40 animate-pulse-slow bg-emerald-600 text-slate-950 font-black hover:bg-emerald-500 border-emerald-400' 
                      : ''
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0
                      ${(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA') && !loading
                        ? 'bg-slate-950 text-emerald-400' 
                        : 'bg-slate-850 text-slate-400'
                      }`}
                    >
                      2
                    </div>
                    <div>
                      <h3 className={`font-black text-sm md:text-base tracking-wide uppercase leading-tight
                        ${(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA') && !loading
                          ? 'text-slate-950' 
                          : (routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO' ? 'text-slate-500' : 'text-emerald-400')
                        }`}
                      >
                        ¡Llegué a Destino!
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5
                        ${(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA') && !loading
                          ? 'text-slate-950/70' 
                          : 'text-slate-500'
                        }`}
                      >
                        {(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA') ? 'Siguiente paso recomendado' : (routeInfo.status === 'LLEGADO' || routeInfo.status === 'FINALIZADO' ? 'Llegado' : 'Pendiente de inicio')}
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg shrink-0
                    ${(routeInfo.status === 'EN VIAJE' || routeInfo.status === 'EN RUTA') && !loading
                      ? 'bg-slate-950/10 text-slate-950' 
                      : 'bg-slate-850/50 text-slate-400'
                    }`}
                  >
                    <MapPin size={20} />
                  </div>
                </button>

                {/* 3. Finalizar Ruta */}
                <button 
                  onClick={() => updateStatus('FINALIZADO')}
                  disabled={loading || routeInfo.status === 'FINALIZADO'}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 
                    ${(routeInfo.status === 'FINALIZADO') 
                      ? 'bg-slate-950/30 text-slate-500 border-slate-900 opacity-40 cursor-not-allowed scale-100' 
                      : 'bg-red-600/10 hover:bg-red-600/15 border-red-500/20 active:scale-[0.98] cursor-pointer text-red-400'
                    }
                    ${routeInfo.status === 'LLEGADO' && !loading
                      ? 'ring-2 ring-red-500/40 animate-pulse-slow bg-red-600 text-slate-950 font-black hover:bg-red-500 border-red-400' 
                      : ''
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0
                      ${routeInfo.status === 'LLEGADO' && !loading
                        ? 'bg-slate-950 text-red-400' 
                        : 'bg-slate-850 text-slate-400'
                      }`}
                    >
                      3
                    </div>
                    <div>
                      <h3 className={`font-black text-sm md:text-base tracking-wide uppercase leading-tight
                        ${routeInfo.status === 'LLEGADO' && !loading
                          ? 'text-slate-950' 
                          : (routeInfo.status === 'FINALIZADO' ? 'text-slate-500' : 'text-red-400')
                        }`}
                      >
                        Finalizar Ruta
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5
                        ${routeInfo.status === 'LLEGADO' && !loading
                          ? 'text-slate-950/70' 
                          : 'text-slate-500'
                        }`}
                      >
                        {routeInfo.status === 'LLEGADO' ? 'Siguiente paso recomendado' : (routeInfo.status === 'FINALIZADO' ? 'Ruta completada' : 'Pendiente de llegada')}
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg shrink-0
                    ${routeInfo.status === 'LLEGADO' && !loading
                      ? 'bg-slate-950/10 text-slate-950' 
                      : 'bg-slate-850/50 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 size={20} />
                  </div>
                </button>
              </div>
            </Card>

            {/* 4. Cuadro de Ruta / Timing (Itinerario) */}
            <Card className="p-5 border-slate-850 bg-slate-900/50 text-left">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block text-center mb-3">Itinerario y Puntos de Control</span>
              
              <div className="space-y-4 text-sm text-slate-300">
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
