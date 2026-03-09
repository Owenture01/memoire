import { motion } from 'motion/react';
import { useState, ChangeEvent } from 'react';
import { MapPin, Calendar as CalendarIcon, Clock, ArrowLeft } from 'lucide-react';

const OUTLETS = [
  "L'Oréal Luxe Boutique, Champs-Élysées",
  "Mémoire Studio, Le Marais",
  "Galeries Lafayette Haussmann",
  "Printemps Beauté"
];

const DATES = ["Today", "Tomorrow", "Oct 24", "Oct 25", "Oct 26"];
const TIMES = ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM"];

export default function Appointment({ 
  onNext, 
  onBack, 
  initialData
}: { 
  onNext: (data: any) => void, 
  onBack: () => void, 
  initialData?: { outlet?: string; date?: string; time?: string } | null,
  key?: string
}) {
  const [outlet, setOutlet] = useState(initialData?.outlet || OUTLETS[0]);
  const [date, setDate] = useState(initialData?.date || DATES[1]);
  const [time, setTime] = useState(initialData?.time || TIMES[2]);
  const [isCustomDate, setIsCustomDate] = useState(initialData?.date ? !DATES.includes(initialData.date) : false);

  const handleDateSelect = (selectedDate: string) => {
    setDate(selectedDate);
    setIsCustomDate(false);
  };

  const handleCustomDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate(val);
    setIsCustomDate(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col pt-12 pb-8 px-6 min-h-screen"
    >
      <button 
        onClick={onBack}
        className="p-2 -ml-2 text-champagne/50 hover:text-champagne transition-colors self-start mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="mb-10">
        <h1 className="text-4xl font-serif mb-4">Atelier Reservation</h1>
        <p className="text-champagne/70 font-light">Book your exclusive session to finalize your bespoke fragrance.</p>
      </div>

      <div className="space-y-8 flex-1">
        {/* Outlet Selection */}
        <div className="space-y-4">
          <label className="flex items-center text-xs uppercase tracking-widest text-champagne/70">
            <MapPin className="w-4 h-4 mr-2" /> Boutique
          </label>
          <div className="relative">
            <select 
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full bg-obsidian-light border border-champagne/20 rounded-none px-4 py-4 text-champagne appearance-none focus:outline-none focus:border-champagne transition-colors font-serif text-lg"
            >
              {OUTLETS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-champagne/50">
              ▼
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <label className="flex items-center text-xs uppercase tracking-widest text-champagne/70">
            <CalendarIcon className="w-4 h-4 mr-2" /> Date
          </label>
          <div className="flex overflow-x-auto pb-2 -mx-6 px-6 space-x-3 scrollbar-hide">
            {DATES.map(d => (
              <button
                key={d}
                onClick={() => handleDateSelect(d)}
                className={`flex-shrink-0 px-6 py-3 border transition-colors whitespace-nowrap
                  ${date === d && !isCustomDate
                    ? 'border-champagne bg-champagne text-obsidian font-medium' 
                    : 'border-champagne/20 text-champagne hover:border-champagne/50'
                  }`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => setIsCustomDate(true)}
              className={`flex-shrink-0 px-6 py-3 border transition-colors whitespace-nowrap
                ${isCustomDate 
                  ? 'border-champagne bg-champagne text-obsidian font-medium' 
                  : 'border-champagne/20 text-champagne hover:border-champagne/50'
                }`}
            >
              Custom Date
            </button>
          </div>

          {isCustomDate && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <input 
                type="date"
                value={DATES.includes(date) ? "" : date}
                onChange={handleCustomDateChange}
                className="w-full bg-obsidian-light border border-champagne/20 rounded-none px-4 py-4 text-champagne focus:outline-none focus:border-champagne transition-colors font-serif text-lg"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-champagne/50">
                📅
              </div>
            </motion.div>
          )}
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <label className="flex items-center text-xs uppercase tracking-widest text-champagne/70">
            <Clock className="w-4 h-4 mr-2" /> Time
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`py-3 border transition-colors text-sm
                  ${time === t 
                    ? 'border-champagne bg-champagne text-obsidian font-medium' 
                    : 'border-champagne/20 text-champagne hover:border-champagne/50'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => onNext({ outlet, date, time })}
        className="w-full bg-champagne text-obsidian py-4 uppercase tracking-widest text-sm font-medium hover:bg-champagne-light transition-colors mt-8"
      >
        Confirm Appointment
      </button>
    </motion.div>
  );
}
