import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export default function Login({ onLogin }: { onLogin: (user: { email: string; name: string; uid: string }) => void, key?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (!name) throw new Error("Please enter your name");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        const userDoc = {
          uid: user.uid,
          name: name,
          email: email,
          createdAt: serverTimestamp()
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userDoc);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
        }

        onLogin({ email: user.email!, name: name, uid: user.uid });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        onLogin({ email: user.email!, name: user.displayName || "Guest", uid: user.uid });
      }
    } catch (err: any) {
      console.error(err);
      const errorCode = err.code;
      
      if (errorCode === 'auth/invalid-credential' || 
          errorCode === 'auth/user-not-found' || 
          errorCode === 'auth/wrong-password') {
        setError('Invalid credentials. Please verify your Beauty ID and password.');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('This Beauty ID is already registered.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Please enter a valid Beauty ID (email).');
      } else if (errorCode === 'auth/operation-not-allowed') {
        setError('Authentication is currently unavailable. Please contact support.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // Create user doc if new
        const newUserDoc = {
          uid: user.uid,
          name: user.displayName || "Guest",
          email: user.email!,
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, newUserDoc);
      }
      
      onLogin({ 
        email: user.email!, 
        name: user.displayName || "Guest", 
        uid: user.uid 
      });
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      // Check if user exists in Firestore (unlikely for anonymous but good practice)
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        const newUserDoc = {
          uid: user.uid,
          name: "Guest Explorer",
          email: "guest@memoire.luxury",
          isGuest: true,
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, newUserDoc);
      }
      
      onLogin({ 
        email: "guest@memoire.luxury", 
        name: "Guest Explorer", 
        uid: user.uid 
      });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/admin-restricted-operation') {
        setError('Guest access is currently disabled. Please enable "Anonymous Authentication" in the Firebase Console.');
      } else {
        setError('Guest sign-in failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-screen"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <Logo />
        </motion.div>

        <motion.form 
          onSubmit={handleAuth}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-6"
        >
          {/* Prototype Quick Access */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-[1px] w-4 bg-champagne/30"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-champagne/60 font-medium">Prototype Quick Access</span>
              <div className="h-[1px] w-4 bg-champagne/30"></div>
            </div>
            <button 
              type="button"
              onClick={handleGuestAuth}
              disabled={loading}
              className="w-full bg-champagne text-obsidian py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center justify-center space-x-2 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Enter as Guest</span>
                </>
              )}
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-champagne/10"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em]">
              <span className="bg-obsidian px-4 text-champagne/20">Or use Beauty ID</span>
            </div>
          </div>

          {error && (
            <div className="bg-champagne/5 border border-champagne/10 text-champagne text-sm p-4 text-center uppercase tracking-[0.2em] font-serif italic">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-xs uppercase tracking-widest text-champagne/70 mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-obsidian-light border border-champagne/20 rounded-none px-4 py-3 text-champagne focus:outline-none focus:border-champagne transition-colors"
                  placeholder="Enter your name"
                  required={isSignUp}
                />
              </motion.div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest text-champagne/70 mb-2 ml-1">Beauty ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-light border border-champagne/20 rounded-none px-4 py-3 text-champagne focus:outline-none focus:border-champagne transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-champagne/70 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-light border border-champagne/20 rounded-none px-4 py-3 text-champagne focus:outline-none focus:border-champagne transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-champagne text-obsidian py-4 uppercase tracking-widest text-sm font-medium hover:bg-champagne-light transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full bg-transparent border border-champagne text-champagne py-4 uppercase tracking-widest text-sm font-medium hover:bg-champagne/10 transition-colors"
            >
              {isSignUp ? 'Already have an account?' : 'Create Account'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-champagne/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                <span className="bg-obsidian px-4 text-champagne/30">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-obsidian-light border border-champagne/20 text-champagne py-4 uppercase tracking-widest text-sm font-medium hover:bg-champagne/5 transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
          </div>
          
          {!isSignUp && (
            <div className="text-center mt-8">
              <a href="#" className="text-xs text-champagne/50 hover:text-champagne transition-colors uppercase tracking-wider underline underline-offset-4">
                Forgot Password?
              </a>
            </div>
          )}
        </motion.form>
      </div>
    </motion.div>
  );
}
