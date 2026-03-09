import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Beaker, UserCheck, CheckCircle2 } from 'lucide-react';

export default function Intro({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void, 
  onBack: () => void,
  key?: string
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col pt-12 pb-8 px-6 min-h-screen bg-obsidian"
    >
      <button 
        onClick={onBack}
        className="p-2 -ml-2 text-champagne/50 hover:text-champagne transition-colors self-start mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-champagne/60 mb-4 block">The Journey Begins</span>
          <h1 className="text-4xl font-serif mb-6 leading-tight">The Atelier Experience</h1>
        </motion.div>

        <div className="space-y-8 mt-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-2">The Purpose</h3>
              <p className="text-sm text-champagne/70 font-light leading-relaxed">
                We believe scent is the most intimate form of memory. Our diagnostic test is designed to map your emotional and sensory preferences to create a unique olfactory blueprint.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
              <Beaker className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-2">The Diagnostic</h3>
              <p className="text-sm text-champagne/70 font-light leading-relaxed">
                You will undergo a multi-phase sensory exploration. This digital journey analyzes your resonance with different notes, environments, and memories.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex space-x-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-2">The Appointment</h3>
              <p className="text-sm text-champagne/70 font-light leading-relaxed">
                Following the test, you will book a private session with a Master Perfumer to refine your formulation and receive your hand-bottled bespoke fragrance.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <div className="space-y-3">
              {[
                "Complete Olfactive Diagnostic",
                "Review AI-Generated Blueprint",
                "Select Boutique & Time",
                "Private Master Perfumer Session"
              ].map((step, i) => (
                <div key={i} className="flex items-center text-xs text-champagne/60">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-champagne/40" />
                  {step}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto pt-12"
        >
          <button 
            onClick={onNext}
            className="w-full bg-champagne text-obsidian py-5 uppercase tracking-widest text-sm font-bold hover:bg-white transition-all"
          >
            Begin Diagnostic
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
