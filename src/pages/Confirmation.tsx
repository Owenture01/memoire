import { motion } from 'motion/react';
import { Check, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function Confirmation({ appointmentData, onReset }: { appointmentData: any, onReset: () => void, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-screen"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 rounded-full border border-champagne flex items-center justify-center mb-8 bg-obsidian-light z-10"
      >
        <Check className="w-8 h-8 text-champagne" strokeWidth={1.5} />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center z-10 w-full max-w-sm"
      >
        <h1 className="text-4xl font-serif mb-4">Reservation Confirmed</h1>
        <p className="text-champagne/70 font-light mb-12">
          Your olfactive profile has been securely transmitted to our master perfumers.
        </p>

        <div className="bg-obsidian-light border border-champagne/20 p-6 text-left space-y-6 mb-12 relative overflow-hidden">
          {/* Subtle corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-champagne" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-champagne" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-champagne" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-champagne" />

          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-champagne/50 mr-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-champagne/50 mb-1">Location</div>
              <div className="font-serif text-lg">{appointmentData.outlet || "Mémoire Studio"}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CalendarIcon className="w-5 h-5 text-champagne/50 mr-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-champagne/50 mb-1">Date</div>
              <div className="font-serif text-lg">{appointmentData.date || "Tomorrow"}</div>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="w-5 h-5 text-champagne/50 mr-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-champagne/50 mb-1">Time</div>
              <div className="font-serif text-lg">{appointmentData.time || "02:00 PM"}</div>
            </div>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="text-xs uppercase tracking-widest text-champagne/50 hover:text-champagne transition-colors underline underline-offset-4"
        >
          Return to Home
        </button>
      </motion.div>
    </motion.div>
  );
}
