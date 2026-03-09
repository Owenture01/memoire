import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Wind, Thermometer, Droplets, Power, Zap, Sparkles, Sun, Music, ChevronRight, Plus, X, Loader2 } from 'lucide-react';

interface RoomSettings {
  id: string;
  name: string;
  image: string;
  temperature: number;
  energy: number;
  humidity: number;
  isScentActive: boolean;
  scentIntensity: number;
  isPurifierActive: boolean;
  scentName: string;
  scentLevel: number; // Fluid left percentage
  isLightActive: boolean;
  lightIntensity: number;
  lightColor: string;
}

const SCENT_COLLECTION = [
  'Sandalwood & Bitter Orange',
  'Lavender & White Tea',
  'Eucalyptus & Mint',
  'Cedarwood & Sage',
  'Jasmine & Bergamot',
  'Vanilla & Tobacco Leaf'
];

const INITIAL_ROOMS: RoomSettings[] = [
  {
    id: 'dining',
    name: 'Dining room',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=800&auto=format&fit=crop',
    temperature: 20,
    energy: 320,
    humidity: 45,
    isScentActive: true,
    scentIntensity: 65,
    isPurifierActive: false,
    scentName: 'Sandalwood & Bitter Orange',
    scentLevel: 85,
    isLightActive: true,
    lightIntensity: 80,
    lightColor: 'hsl(35, 100%, 50%)'
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=800&auto=format&fit=crop',
    temperature: 18,
    energy: 150,
    humidity: 40,
    isScentActive: true,
    scentIntensity: 40,
    isPurifierActive: true,
    scentName: 'Lavender & White Tea',
    scentLevel: 42,
    isLightActive: true,
    lightIntensity: 30,
    lightColor: 'hsl(280, 100%, 50%)'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    temperature: 24,
    energy: 80,
    humidity: 65,
    isScentActive: false,
    scentIntensity: 0,
    isPurifierActive: false,
    scentName: 'Eucalyptus & Mint',
    scentLevel: 15,
    isLightActive: false,
    lightIntensity: 0,
    lightColor: 'hsl(180, 100%, 50%)'
  }
];

function ColorWheel({ color, onChange }: { color: string, onChange: (color: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;

    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = (angle + 2) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, endAngle);
      ctx.closePath();
      const gradient = ctx.createRadialGradient(radius, radius, radius * 0.4, radius, radius, radius);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, []);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const hue = (angle + 360) % 360;
    onChange(`hsl(${Math.round(hue)}, 100%, 50%)`);
  };

  return (
    <div className="relative w-40 h-40">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full rounded-full cursor-crosshair"
        onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
        onMouseMove={(e) => isDragging && handleInteraction(e)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}
        onTouchMove={(e) => isDragging && handleInteraction(e)}
        onTouchEnd={() => setIsDragging(false)}
      />
      <div className="absolute inset-0 rounded-full border-4 border-obsidian pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
    </div>
  );
}

export default function SmartHome({ onBack }: { onBack: () => void, key?: string }) {
  const [rooms, setRooms] = useState<RoomSettings[]>(INITIAL_ROOMS);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeRoom = rooms[activeRoomIndex];

  const updateActiveRoom = (updates: Partial<RoomSettings>) => {
    setRooms(prev => prev.map((room, idx) => 
      idx === activeRoomIndex ? { ...room, ...updates } : room
    ));
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newRoom: RoomSettings = {
        id: Math.random().toString(36).substr(2, 9),
        name: newRoomName,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
        temperature: 22,
        energy: 0,
        humidity: 50,
        isScentActive: false,
        scentIntensity: 0,
        isPurifierActive: false,
        scentName: 'Unassigned',
        scentLevel: 100,
        isLightActive: false,
        lightIntensity: 0,
        lightColor: '#FFFFFF'
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setIsAddingRoom(false);
      setIsSubmitting(false);
      // Scroll to the new room after a short delay to allow state update
      setTimeout(() => {
        if (scrollRef.current) {
          const newIdx = rooms.length;
          scrollRef.current.scrollTo({ left: newIdx * (scrollRef.current.offsetWidth * 0.8), behavior: 'smooth' });
          setActiveRoomIndex(newIdx);
        }
      }, 100);
    }, 1000);
  };

  // Handle scroll to snap and update active room
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.offsetWidth * 0.8; // Approximate width of a card
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeRoomIndex && newIndex >= 0 && newIndex < rooms.length) {
      setActiveRoomIndex(newIndex);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col pt-12 pb-8 min-h-screen bg-obsidian text-champagne"
    >
      {/* Header */}
      <div className="px-6 flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-champagne/50 hover:text-champagne transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-champagne">Pro</span>
          </div>
        </div>
      </div>

      <div className="px-6 mb-8">
        <h1 className="text-4xl font-serif mb-2">Hi, Guest</h1>
        <p className="text-champagne/50 text-sm font-light">Monitor and control your home</p>
      </div>

      {/* Room Slider */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar space-x-4 px-6 mb-10 pb-4"
      >
        {rooms.map((room, idx) => (
          <motion.div 
            key={room.id}
            onClick={() => {
              setActiveRoomIndex(idx);
              scrollRef.current?.scrollTo({ left: idx * (scrollRef.current.offsetWidth * 0.8), behavior: 'smooth' });
            }}
            className={`relative shrink-0 w-[80%] aspect-[4/3] rounded-[32px] overflow-hidden snap-center cursor-pointer border-2 transition-colors duration-500
              ${activeRoomIndex === idx ? 'border-champagne' : 'border-transparent opacity-50'}
            `}
          >
            <img 
              src={room.image} 
              alt={room.name}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Top Info Overlay */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 border border-white/10">
                <Thermometer className="w-3 h-3 text-white" />
                <span className="text-xs text-white font-medium">{room.temperature}°C</span>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                <ChevronRight className="w-5 h-5 text-white -rotate-45" />
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <h3 className="text-2xl font-serif text-white">{room.name}</h3>
            </div>
          </motion.div>
        ))}

        {/* Add New Device Card */}
        <motion.div 
          onClick={() => setIsAddingRoom(true)}
          className="relative shrink-0 w-[80%] aspect-[4/3] rounded-[32px] overflow-hidden snap-center cursor-pointer border-2 border-dashed border-champagne/30 bg-champagne/5 flex flex-col items-center justify-center space-y-4 group hover:bg-champagne/10 transition-colors"
        >
          <div className="w-16 h-16 rounded-full border border-champagne/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-champagne/60" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-serif text-champagne/80">Add New Device</h3>
            <p className="text-[10px] uppercase tracking-widest text-champagne/40 mt-1">Expand your smart atelier</p>
          </div>
        </motion.div>
      </div>

      {/* Controls Container */}
      <div className="px-6 space-y-6 flex-1">
        <AnimatePresence mode="wait">
          {activeRoom ? (
            <motion.div 
              key={activeRoom.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Scent Diffuser Control */}
              <div className="bg-obsidian-light border border-champagne/20 p-6 space-y-6 rounded-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${activeRoom.isScentActive ? 'bg-champagne/20 text-champagne' : 'bg-white/5 text-white/20'}`}>
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg">Olfactive Diffuser</h3>
                      <p className="text-[10px] uppercase tracking-widest text-champagne/40">Scent Experience</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateActiveRoom({ isScentActive: !activeRoom.isScentActive })}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${activeRoom.isScentActive ? 'bg-champagne' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-obsidian transition-transform duration-300 ${activeRoom.isScentActive ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {activeRoom.isScentActive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-6 pt-4 border-t border-champagne/10"
                  >
                    {/* Scent Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-champagne/60">Selected Scent</label>
                      <select 
                        value={activeRoom.scentName}
                        onChange={(e) => updateActiveRoom({ scentName: e.target.value })}
                        className="w-full bg-obsidian border border-champagne/20 px-4 py-3 text-champagne text-sm focus:outline-none focus:border-champagne appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F5E6CA' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                      >
                        {SCENT_COLLECTION.map(scent => (
                          <option key={scent} value={scent} className="bg-obsidian">{scent}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fluid Level Indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest">
                        <span className="text-champagne/60">Fluid Level</span>
                        <span className={activeRoom.scentLevel < 20 ? 'text-red-400 animate-pulse' : 'text-champagne/60'}>
                          {activeRoom.scentLevel}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-champagne/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${activeRoom.scentLevel}%` }}
                          className={`h-full rounded-full ${activeRoom.scentLevel < 20 ? 'bg-red-400' : 'bg-champagne'}`}
                        />
                      </div>
                      {activeRoom.scentLevel < 20 && (
                        <p className="text-[9px] text-red-400/80 italic">Refill cartridge soon</p>
                      )}
                    </div>

                    {/* Intensity Slider */}
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest text-champagne/60">
                        <span>Intensity</span>
                        <span>{activeRoom.scentIntensity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={activeRoom.scentIntensity}
                        onChange={(e) => updateActiveRoom({ scentIntensity: parseInt(e.target.value) })}
                        className="w-full h-1 bg-champagne/20 rounded-lg appearance-none cursor-pointer accent-champagne"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Climate Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-obsidian-light border border-champagne/20 p-6 flex flex-col items-center text-center space-y-4 rounded-3xl">
                  <Thermometer className="w-6 h-6 text-champagne/60" strokeWidth={1} />
                  <div>
                    <span className="text-3xl font-serif">{activeRoom.temperature}°C</span>
                    <p className="text-[10px] uppercase tracking-widest text-champagne/40 mt-1">Temperature</p>
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => updateActiveRoom({ temperature: activeRoom.temperature - 1 })}
                      className="w-8 h-8 rounded-full border border-champagne/20 flex items-center justify-center hover:bg-champagne/5"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateActiveRoom({ temperature: activeRoom.temperature + 1 })}
                      className="w-8 h-8 rounded-full border border-champagne/20 flex items-center justify-center hover:bg-champagne/5"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-obsidian-light border border-champagne/20 p-6 flex flex-col items-center text-center space-y-4 rounded-3xl">
                  <Droplets className="w-6 h-6 text-champagne/60" strokeWidth={1} />
                  <div>
                    <span className="text-3xl font-serif">{activeRoom.humidity}%</span>
                    <p className="text-[10px] uppercase tracking-widest text-champagne/40 mt-1">Humidity</p>
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => updateActiveRoom({ humidity: Math.max(0, activeRoom.humidity - 5) })}
                      className="w-8 h-8 rounded-full border border-champagne/20 flex items-center justify-center hover:bg-champagne/5"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateActiveRoom({ humidity: Math.min(100, activeRoom.humidity + 5) })}
                      className="w-8 h-8 rounded-full border border-champagne/20 flex items-center justify-center hover:bg-champagne/5"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Air Purifier */}
              <button 
                onClick={() => updateActiveRoom({ isPurifierActive: !activeRoom.isPurifierActive })}
                className={`w-full p-6 border transition-all duration-500 flex items-center justify-between rounded-3xl
                  ${activeRoom.isPurifierActive ? 'bg-champagne/10 border-champagne' : 'bg-obsidian-light border-champagne/20'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${activeRoom.isPurifierActive ? 'bg-champagne text-obsidian' : 'bg-white/5 text-white/20'}`}>
                    <Zap className={`w-5 h-5 ${activeRoom.isPurifierActive ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif text-lg">Air Purifier</h3>
                    <p className="text-[10px] uppercase tracking-widest text-champagne/40">HEPA-13 Filtration</p>
                  </div>
                </div>
                <Power className={`w-5 h-5 ${activeRoom.isPurifierActive ? 'text-champagne' : 'text-champagne/20'}`} />
              </button>

              {/* Light Control */}
              <div className="bg-obsidian-light border border-champagne/20 p-6 space-y-6 rounded-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${activeRoom.isLightActive ? 'bg-champagne/20 text-champagne' : 'bg-white/5 text-white/20'}`}>
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg">Smart Lighting</h3>
                      <p className="text-[10px] uppercase tracking-widest text-champagne/40">Ambiance Control</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateActiveRoom({ isLightActive: !activeRoom.isLightActive })}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${activeRoom.isLightActive ? 'bg-champagne' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-obsidian transition-transform duration-300 ${activeRoom.isLightActive ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {activeRoom.isLightActive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-6 pt-4 border-t border-champagne/10"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest text-champagne/60">
                        <span>Brightness</span>
                        <span>{activeRoom.lightIntensity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={activeRoom.lightIntensity}
                        onChange={(e) => updateActiveRoom({ lightIntensity: parseInt(e.target.value) })}
                        className="w-full h-1 bg-champagne/20 rounded-lg appearance-none cursor-pointer accent-champagne"
                      />
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-[10px] uppercase tracking-widest text-champagne/60 w-full">Color Spectrum</div>
                      <ColorWheel 
                        color={activeRoom.lightColor} 
                        onChange={(color) => updateActiveRoom({ lightColor: color })} 
                      />
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: activeRoom.lightColor }}
                        />
                        <span className="text-[10px] uppercase tracking-widest text-champagne/40">{activeRoom.lightColor}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12"
            >
              <div className="w-16 h-16 rounded-full bg-champagne/5 border border-dashed border-champagne/20 flex items-center justify-center">
                <Plus className="w-8 h-8 text-champagne/20" />
              </div>
              <p className="text-champagne/40 font-light italic">Select a device to view controls</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Room Modal */}
      <AnimatePresence>
        {isAddingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsAddingRoom(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-obsidian-light border border-champagne/20 p-8 z-10"
            >
              <button 
                onClick={() => setIsAddingRoom(false)}
                className="absolute top-4 right-4 text-champagne/40 hover:text-champagne"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-serif mb-6">Add New Device</h3>
              <form onSubmit={handleAddRoom} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-champagne/50 mb-2">Room Name</label>
                  <input 
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Living Room, Study..."
                    className="w-full bg-obsidian border border-champagne/20 px-4 py-3 text-champagne focus:outline-none focus:border-champagne placeholder:text-champagne/20"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newRoomName}
                  className="w-full bg-champagne text-obsidian py-3 uppercase tracking-widest text-xs font-medium hover:bg-champagne-light transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Device'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-8 px-6 border-t border-champagne/10 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-champagne/30">
          Connected to Mémoire Hub v2.4
        </p>
      </div>
    </motion.div>
  );
}

