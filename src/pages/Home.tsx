import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, User, LogOut, ChevronRight, Edit2, X, Loader2, Wind, Lock } from 'lucide-react';
import Logo from '../components/Logo';
import { useState, FormEvent } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface AppointmentData {
  outlet?: string;
  date?: string;
  time?: string;
}

interface UserData {
  email: string;
  name: string;
  uid: string;
  diagnosticProgress?: {
    currentStep: number;
    selections: any;
  };
}

export default function Home({ 
  user, 
  appointment, 
  onStartDiagnostic, 
  onModifyAppointment,
  onCancelAppointment,
  onDiscardDiagnostic,
  onLogout,
  onUpdateUser,
  onNavigateToSmartHome
}: { 
  user: UserData; 
  appointment: AppointmentData | null; 
  onStartDiagnostic: () => void;
  onModifyAppointment: () => void;
  onCancelAppointment: () => void;
  onDiscardDiagnostic: () => void;
  onLogout: () => void;
  onUpdateUser: (userData: UserData) => void;
  onNavigateToSmartHome: () => void;
  key?: string;
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const hasAppointment = appointment && appointment.outlet && appointment.date && appointment.time;
  const hasSavedProgress = !!user.diagnosticProgress;

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancelAppointment();
      setIsConfirmingCancel(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName || newName === user.name) {
      setIsEditingProfile(false);
      return;
    }

    setUpdating(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName });
        try {
          await updateDoc(doc(db, 'users', user.uid), { name: newName });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
        }
        onUpdateUser({ ...user, name: newName });
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col p-6 min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <Logo size="small" showTagline={false} />
        <button 
          onClick={onLogout}
          className="p-2 text-champagne/50 hover:text-champagne transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border border-champagne/30 flex items-center justify-center bg-obsidian-light">
              <User className="w-6 h-6 text-champagne/70" strokeWidth={1} />
            </div>
            <div>
              <h2 className="text-2xl font-serif">{user.name}</h2>
              <p className="text-xs text-champagne/50 uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="p-2 text-champagne/40 hover:text-champagne transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !updating && setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-obsidian-light border border-champagne/20 p-8 z-10"
            >
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="absolute top-4 right-4 text-champagne/40 hover:text-champagne"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-serif mb-6">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-champagne/50 mb-2">Display Name</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-obsidian border border-champagne/20 px-4 py-3 text-champagne focus:outline-none focus:border-champagne"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full bg-champagne text-obsidian py-3 uppercase tracking-widest text-xs font-medium hover:bg-champagne-light transition-colors flex items-center justify-center"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !cancelling && setIsConfirmingCancel(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-obsidian-light border border-champagne/20 p-8 z-10 text-center"
            >
              <h3 className="text-2xl font-serif mb-4">Cancel Reservation?</h3>
              <p className="text-sm text-champagne/60 font-light italic mb-8">
                Are you sure you wish to cancel your fragrance atelier session? This action cannot be undone.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full bg-red-500 text-white py-3 uppercase tracking-widest text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Cancellation'}
                </button>
                <button 
                  onClick={() => setIsConfirmingCancel(false)}
                  disabled={cancelling}
                  className="w-full bg-transparent border border-champagne/20 text-champagne py-3 uppercase tracking-widest text-xs font-medium hover:bg-champagne/5 transition-colors"
                >
                  Keep Reservation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment Section */}
      <div className="flex-1 space-y-8">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-champagne/40 mb-4">Your Reservations</h3>
          
          {hasAppointment ? (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-obsidian-light border border-champagne/20 p-6 space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-champagne/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-champagne/60 mr-3 mt-1 shrink-0" />
                <span className="font-serif text-lg">{appointment.outlet}</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-champagne/60 mr-3 shrink-0" />
                  <span className="text-sm font-light">{appointment.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-champagne/60 mr-3 shrink-0" />
                  <span className="text-sm font-light">{appointment.time}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-champagne/10 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Confirmed
                </span>
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setIsConfirmingCancel(true)}
                    className="text-[10px] uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={onModifyAppointment}
                    className="text-[10px] uppercase tracking-widest text-champagne/50 hover:text-champagne transition-colors"
                  >
                    Modify
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-obsidian-light border border-dashed border-champagne/20 p-8 text-center">
              <p className="text-champagne/50 font-light italic mb-6">No active fragrance appointments scheduled.</p>
              <div className="flex flex-col space-y-3 items-center">
                <button 
                  onClick={onStartDiagnostic}
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-obsidian bg-champagne px-8 py-4 hover:bg-champagne-light transition-colors w-full sm:w-auto justify-center"
                >
                  <span>{hasSavedProgress ? 'Resume Olfactive Journey' : 'Book Atelier Session'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                
                {hasSavedProgress && (
                  <div className="flex flex-col space-y-2 items-center">
                    <span className="text-[10px] uppercase tracking-widest text-champagne/40">
                      Saved progress from Phase 0{user.diagnosticProgress!.currentStep + 1}
                    </span>
                    <button 
                      onClick={onDiscardDiagnostic}
                      className="text-[8px] uppercase tracking-widest text-champagne/30 hover:text-red-500 transition-colors underline underline-offset-4"
                    >
                      Discard & Start Fresh
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Smart Home Widget */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-champagne/40 mb-4">Atelier Controls</h3>
          <div className="relative">
            <button 
              onClick={hasAppointment ? onNavigateToSmartHome : undefined}
              disabled={!hasAppointment}
              className={`w-full bg-obsidian-light border border-champagne/20 p-6 flex items-center justify-between group transition-colors
                ${hasAppointment ? 'hover:border-champagne/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full border border-champagne/20 flex items-center justify-center bg-obsidian transition-colors
                  ${hasAppointment ? 'group-hover:bg-champagne/5' : ''}
                `}>
                  {hasAppointment ? (
                    <Wind className="w-6 h-6 text-champagne/70" strokeWidth={1} />
                  ) : (
                    <Lock className="w-5 h-5 text-champagne/40" strokeWidth={1} />
                  )}
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-lg">Connect to Smart Home</h4>
                  <p className="text-[10px] uppercase tracking-widest text-champagne/40">
                    {hasAppointment ? 'Control scent, temperature & air' : 'Feature locked until appointment confirmed'}
                  </p>
                </div>
              </div>
              {hasAppointment && <ChevronRight className="w-5 h-5 text-champagne/30 group-hover:text-champagne transition-colors" />}
            </button>
            
            {!hasAppointment && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-obsidian/80 backdrop-blur-[2px] px-4 py-2 border border-champagne/10 text-[10px] uppercase tracking-[0.2em] text-champagne/60">
                  Reservation Required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Discover */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-champagne/40 mb-4">Discover</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] bg-obsidian-light border border-champagne/10 p-4 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/perfume1/400/500')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative z-10">
                <span className="text-[8px] uppercase tracking-widest text-champagne/60">L'Héritage</span>
                <h4 className="font-serif text-lg">The Art of Scent</h4>
              </div>
            </div>
            <div className="aspect-[4/5] bg-obsidian-light border border-champagne/10 p-4 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/perfume2/400/500')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative z-10">
                <span className="text-[8px] uppercase tracking-widest text-champagne/60">Collection</span>
                <h4 className="font-serif text-lg">Luxe Privé</h4>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="pt-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-champagne/40 mb-4">L'Essence de Mémoire</h3>
          <div className="bg-obsidian-light border border-champagne/10 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/heritage/800/600')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
            <div className="relative z-10 space-y-4">
              <p className="text-sm font-light leading-relaxed text-champagne/80 italic">
                "A scent that outlasts time."
              </p>
              <p className="text-sm font-light leading-relaxed text-champagne/70">
                Mémoire by L'Oréal is an invitation to traverse the landscape of your own history. Born from the intersection of haute perfumery and emotional resonance, we believe that every individual carries a unique olfactive fingerprint.
              </p>
              <p className="text-sm font-light leading-relaxed text-champagne/70">
                Our bespoke atelier experience is a collaborative masterpiece between you and our master perfumers. Using the rarest essences and innovative diagnostic science, we don't just create a perfume—we encapsulate a memory, a dream, and your true essence in a singular, timeless bottle.
              </p>
              <div className="pt-4 flex items-center space-x-4">
                <div className="h-[1px] w-8 bg-champagne/30" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-champagne/50">Heritage & Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA if has appointment */}
      {hasAppointment && (
        <button 
          onClick={onStartDiagnostic}
          className="w-full bg-transparent border border-champagne/30 text-champagne/70 py-4 uppercase tracking-widest text-[10px] font-medium hover:bg-champagne/5 transition-colors mt-8"
        >
          Retake Olfactive Diagnostic
        </button>
      )}
    </motion.div>
  );
}
