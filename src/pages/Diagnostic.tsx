import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Droplets, 
  Flower2, 
  Wind, 
  Sun, 
  CloudRain, 
  Music, 
  Waves, 
  VolumeX, 
  ArrowLeft, 
  Home, 
  X,
  Snowflake,
  Flame,
  Thermometer,
  Heart,
  Zap,
  Sparkles as SparklesIcon,
  Users,
  User as UserIcon,
  History,
  Trophy,
  Shield,
  AlertCircle,
  Ban
} from 'lucide-react';

const STEPS = [
  {
    id: 'scent',
    title: 'Olfactive Signature',
    subtitle: 'Select the essence that speaks to your soul',
    options: [
      { id: 'orange', label: 'Bitter Orange', icon: Sun, desc: 'Zesty, vibrant, awakening' },
      { id: 'lily', label: 'White Lily', icon: Flower2, desc: 'Pure, elegant, luminous' },
      { id: 'sandalwood', label: 'Sandalwood', icon: Wind, desc: 'Warm, creamy, grounding' },
      { id: 'rose', label: 'Damascus Rose', icon: Droplets, desc: 'Velvety, romantic, deep' },
    ]
  },
  {
    id: 'color',
    title: 'Visual Aura',
    subtitle: 'Choose the palette of your memory',
    options: [
      { id: 'sunset', label: 'Golden Sunset', color: 'bg-gradient-to-br from-orange-400 to-red-600' },
      { id: 'midnight', label: 'Midnight Velvet', color: 'bg-gradient-to-br from-blue-900 to-black' },
      { id: 'dawn', label: 'Ethereal Dawn', color: 'bg-gradient-to-br from-rose-200 to-teal-100' },
      { id: 'forest', label: 'Deep Forest', color: 'bg-gradient-to-br from-emerald-800 to-green-950' },
    ]
  },
  {
    id: 'sound',
    title: 'Sonic Landscape',
    subtitle: 'What is the rhythm of your fragrance?',
    options: [
      { id: 'ocean', label: 'Ocean Waves', icon: Waves },
      { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
      { id: 'jazz', label: 'Midnight Jazz', icon: Music },
      { id: 'silence', label: 'Pure Silence', icon: VolumeX },
    ]
  },
  {
    id: 'temperature',
    title: 'Thermal Atmosphere',
    subtitle: 'What is the temperature of the air in your memory?',
    options: [
      { id: 'crisp', label: 'Crisp & Icy', icon: Snowflake, desc: 'Aldehydic, sharp, clean' },
      { id: 'balmy', label: 'Balmy & Warm', icon: Flame, desc: 'Amber, enveloping, soft' },
      { id: 'humid', label: 'Humid & Rainy', icon: Thermometer, desc: 'Ozone, earthy, petrichor' },
      { id: 'dry', label: 'Dry & Radiant', icon: Sun, desc: 'Solar, intense, glowing' },
    ]
  },
  {
    id: 'emotion',
    title: 'Emotional Territory',
    subtitle: 'In which realm does this olfactive memory reside?',
    options: [
      { id: 'wellness', label: 'Mindful Wellness', icon: Heart, desc: 'Reconnecting, calm, peace' },
      { id: 'assertion', label: 'Personal Assertion', icon: Zap, desc: 'Confidence, power, drive' },
      { id: 'stimulation', label: 'Sensorial Stimulation', icon: SparklesIcon, desc: 'Pleasure, vivid memories' },
      { id: 'social', label: 'Social Impact', icon: Users, desc: 'Seduction, belonging, aura' },
    ]
  },
  {
    id: 'representation',
    title: 'Olfactive Identity',
    subtitle: 'Whose essence does this fragrance seek to capture?',
    options: [
      { id: 'self', label: 'My True Self', icon: UserIcon, desc: 'Individual, authentic, raw' },
      { id: 'bond', label: 'A Shared Bond', icon: Users, desc: 'Community, connection, love' },
      { id: 'moment', label: 'A Lost Moment', icon: History, desc: 'Nostalgia, echoes, time' },
      { id: 'dream', label: 'A Future Dream', icon: Trophy, desc: 'Ambition, vision, destiny' },
    ]
  },
  {
    id: 'safety',
    title: 'Olfactive Safety',
    subtitle: 'Are there any sensitivities we should honor during your atelier session?',
    type: 'text',
    placeholder: 'Please describe any known allergies or skin sensitivities (e.g., specific florals, nuts, or alcohol sensitivity)...'
  }
];

export default function Diagnostic({ 
  onNext, 
  onSaveLater, 
  onDiscard,
  initialStep = 0,
  initialSelections = {}
}: { 
  onNext: (data: any) => void;
  onSaveLater: (step: number, selections: any) => void;
  onDiscard: () => void;
  initialStep?: number;
  initialSelections?: any;
  key?: string;
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selections, setSelections] = useState<Record<string, string>>(initialSelections);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleSelect = (optionId: string) => {
    const newSelections = { ...selections, [STEPS[currentStep].id]: optionId };
    setSelections(newSelections);
    
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onNext(newSelections);
      }
    }, 400);
  };

  const handleTextSubmit = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onNext(selections);
    }
  };

  const step = STEPS[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col pt-12 pb-8 px-6 relative min-h-screen"
    >
      {/* Progress & Navigation */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
            className={`p-2 -ml-2 text-champagne/50 hover:text-champagne transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowExitDialog(true)}
            className="p-2 text-champagne/50 hover:text-champagne transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex space-x-1">
          {STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-0.5 w-5 transition-colors duration-500 ${idx <= currentStep ? 'bg-champagne' : 'bg-champagne/20'}`}
            />
          ))}
        </div>
        <div className="w-12" /> {/* Spacer for balance */}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col"
        >
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-champagne/60 mb-4">Phase 0{currentStep + 1}</h2>
            <h1 className="text-4xl font-serif mb-4">{step.title}</h1>
            <p className="text-champagne/70 font-light">{step.subtitle}</p>
          </div>

          {step.type === 'text' ? (
            <div className="flex-1 flex flex-col mt-auto mb-auto">
              <textarea
                value={selections[step.id] || ''}
                onChange={(e) => setSelections({ ...selections, [step.id]: e.target.value })}
                placeholder={step.placeholder}
                className="w-full h-48 bg-obsidian-light border border-champagne/20 p-6 text-champagne focus:outline-none focus:border-champagne transition-colors font-light italic resize-none"
              />
              <button
                onClick={handleTextSubmit}
                className="w-full bg-champagne text-obsidian py-4 uppercase tracking-widest text-sm font-medium hover:bg-champagne-light transition-colors mt-8"
              >
                {currentStep === STEPS.length - 1 ? 'Complete Journey' : 'Continue'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-auto mb-auto">
              {step.options?.map((opt) => {
                const isSelected = selections[step.id] === opt.id;
                const Icon = opt.icon;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`relative aspect-square flex flex-col items-center justify-center p-4 border transition-all duration-300 overflow-hidden group
                      ${isSelected 
                        ? 'border-champagne bg-champagne/10' 
                        : 'border-champagne/20 hover:border-champagne/50 bg-obsidian-light'
                      }`}
                  >
                    {step.id === 'color' && opt.color && (
                      <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity ${opt.color}`} />
                    )}
                    
                    <div className="relative z-10 flex flex-col items-center">
                      {Icon && <Icon className={`w-8 h-8 mb-4 ${isSelected ? 'text-champagne' : 'text-champagne/70'}`} strokeWidth={1} />}
                      <span className="font-serif text-lg text-center leading-tight">{opt.label}</span>
                      {opt.desc && (
                        <span className="text-[10px] uppercase tracking-wider text-champagne/50 mt-2 text-center">{opt.desc}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Exit Dialog */}
      <AnimatePresence>
        {showExitDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitDialog(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-obsidian-light border border-champagne/20 p-8 z-10 text-center"
            >
              <button 
                onClick={() => setShowExitDialog(false)}
                className="absolute top-4 right-4 text-champagne/40 hover:text-champagne"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-serif mb-4">Pause Diagnostic?</h3>
              <p className="text-sm text-champagne/60 font-light italic mb-8">
                Would you like to save your progress and return later, or continue your olfactive journey now?
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => onSaveLater(currentStep, selections)}
                  className="w-full bg-champagne text-obsidian py-3 uppercase tracking-widest text-xs font-medium hover:bg-champagne-light transition-colors"
                >
                  Do Later
                </button>
                <button 
                  onClick={() => setShowExitDialog(false)}
                  className="w-full bg-transparent border border-champagne/20 text-champagne py-3 uppercase tracking-widest text-xs font-medium hover:bg-champagne/5 transition-colors"
                >
                  Continue
                </button>
                <button 
                  onClick={onDiscard}
                  className="w-full bg-transparent text-red-500/60 py-3 uppercase tracking-widest text-[10px] font-medium hover:text-red-500 transition-colors"
                >
                  Discard Progress
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
