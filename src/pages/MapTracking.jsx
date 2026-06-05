import { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import { Play, Pause, Square, Footprints, Timer, Coins, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapTracking() {
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [route, setRoute] = useState([]);
  const [position, setPosition] = useState([41.2995, 69.2401]); // Tashkent
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coins, setCoins] = useState(0);
  const watchRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const startTracking = useCallback(() => {
    setTracking(true);
    setPaused(false);
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setCoins(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    if ('geolocation' in navigator) {
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setRoute((prev) => {
            const updated = [...prev, newPos];
            if (updated.length > 1) {
              const last = updated[updated.length - 2];
              const d = calcDistance(last[0], last[1], newPos[0], newPos[1]);
              setDistance((p) => {
                const newDist = p + d;
                setCoins(Math.floor(newDist * 5));
                return newDist;
              });
            }
            return updated;
          });
        },
        (err) => console.log('GPS error:', err.message),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );
    }
  }, []);

  const stopTracking = useCallback(async () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setTracking(false);
    setPaused(false);

    if (distance > 0.01) {
      const calories = Math.round(distance * 60);
      const earnedCoins = Math.floor(distance * 5);

      await base44.entities.Activity.create({
        type: 'walk',
        distance_km: parseFloat(distance.toFixed(2)),
        duration_minutes: Math.round(duration / 60),
        calories_burned: calories,
        coins_earned: earnedCoins,
        route_coordinates: route.map(([lat, lng]) => ({ lat, lng })),
        start_time: new Date(startTimeRef.current).toISOString(),
        end_time: new Date().toISOString(),
        is_new_route: true,
        avg_speed_kmh: parseFloat(((distance / (duration / 3600)) || 0).toFixed(1)),
        status: 'completed',
      });

      // Update profile
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      if (profiles[0]) {
        await base44.entities.UserProfile.update(profiles[0].id, {
          total_distance_km: (profiles[0].total_distance_km || 0) + parseFloat(distance.toFixed(2)),
          total_coins: (profiles[0].total_coins || 0) + earnedCoins,
          total_calories: (profiles[0].total_calories || 0) + calories,
          total_time_minutes: (profiles[0].total_time_minutes || 0) + Math.round(duration / 60),
        });
      }
    }
  }, [distance, duration, route]);

  const togglePause = () => {
    if (paused) {
      startTimeRef.current = Date.now() - duration * 1000;
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    setPaused(!paused);
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={position}
          zoom={16}
          className="h-full w-full z-0"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          />
          <MapUpdater center={position} />
          {position && <Marker position={position} />}
          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{ color: 'hsl(160, 84%, 39%)', weight: 4, opacity: 0.8 }}
            />
          )}
        </MapContainer>
      </div>

      {/* Stats Overlay */}
      <AnimatePresence>
        {tracking && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 glass-strong rounded-2xl p-4 z-10"
          >
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Footprints className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Masofa</span>
                </div>
                <p className="text-lg font-bold font-display">{distance.toFixed(2)} km</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Vaqt</span>
                </div>
                <p className="text-lg font-bold font-display">{formatTime(duration)}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Tangalar</span>
                </div>
                <p className="text-lg font-bold font-display text-accent-foreground">{coins}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 z-10">
        {!tracking ? (
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              onClick={startTracking}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
            >
              <Play className="w-7 h-7" />
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={togglePause}
                className="w-14 h-14 rounded-full glass"
              >
                {paused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                variant="destructive"
                onClick={stopTracking}
                className="w-14 h-14 rounded-full shadow-lg"
              >
                <Square className="w-6 h-6" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}