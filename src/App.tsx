import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import Login from './pages/Login';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Diagnostic from './pages/Diagnostic';
import Appointment from './pages/Appointment';
import Confirmation from './pages/Confirmation';
import SmartHome from './pages/SmartHome';

export type Page = 'login' | 'home' | 'intro' | 'diagnostic' | 'appointment' | 'confirmation' | 'smarthome';

interface UserProfile {
  email: string;
  name: string;
  uid: string;
  diagnosticProgress?: {
    currentStep: number;
    selections: any;
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [diagnosticData, setDiagnosticData] = useState({});
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch profile from Firestore to ensure we have the latest data
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        setUser({
          email: firebaseUser.email!,
          name: userData?.name || firebaseUser.displayName || "Guest",
          uid: firebaseUser.uid,
          diagnosticProgress: userData?.diagnosticProgress
        });
        
        if (currentPage === 'login') {
          setCurrentPage('home');
        }
      } else {
        setUser(null);
        setCurrentPage('login');
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen for appointments
  useEffect(() => {
    if (!user) {
      setAppointmentData(null);
      return;
    }

    const q = query(collection(db, 'appointments'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // For this app, we assume one active appointment
        const doc = snapshot.docs[0];
        setAppointmentData({ ...doc.data(), id: doc.id });
      } else {
        setAppointmentData(null);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'appointments');
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-champagne flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <AnimatePresence mode="wait">
        {currentPage === 'login' && (
          <Login 
            key="login" 
            onLogin={(userData) => {
              setUser(userData);
              setCurrentPage('home');
            }} 
          />
        )}
        {currentPage === 'home' && user && (
          <Home 
            key="home"
            user={user}
            appointment={appointmentData}
            onStartDiagnostic={() => {
              setDiagnosticData({});
              setCurrentPage('intro');
            }}
            onModifyAppointment={() => {
              setCurrentPage('appointment');
            }}
            onCancelAppointment={async () => {
              if (appointmentData?.id) {
                try {
                  await deleteDoc(doc(db, 'appointments', appointmentData.id));
                } catch (err) {
                  handleFirestoreError(err, OperationType.DELETE, `appointments/${appointmentData.id}`);
                }
              }
            }}
            onDiscardDiagnostic={async () => {
              try {
                await setDoc(doc(db, 'users', user.uid), { diagnosticProgress: null }, { merge: true });
                setUser({ ...user, diagnosticProgress: undefined });
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
              }
            }}
            onLogout={handleLogout}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
            onNavigateToSmartHome={() => setCurrentPage('smarthome')}
          />
        )}
        {currentPage === 'intro' && user && (
          <Intro 
            key="intro"
            onNext={() => setCurrentPage('diagnostic')}
            onBack={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'smarthome' && user && (
          <SmartHome 
            key="smarthome"
            onBack={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'diagnostic' && user && (
          <Diagnostic 
            key="diagnostic" 
            initialStep={user.diagnosticProgress?.currentStep}
            initialSelections={user.diagnosticProgress?.selections}
            onNext={async (data) => {
              setDiagnosticData(data);
              // Clear progress on completion
              try {
                await setDoc(doc(db, 'users', user.uid), { diagnosticProgress: null }, { merge: true });
                setUser({ ...user, diagnosticProgress: undefined });
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
              }
              setCurrentPage('appointment');
            }} 
            onSaveLater={async (step, selections) => {
              try {
                const progress = { currentStep: step, selections };
                await setDoc(doc(db, 'users', user.uid), { diagnosticProgress: progress }, { merge: true });
                setUser({ ...user, diagnosticProgress: progress });
                setCurrentPage('home');
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
              }
            }}
            onDiscard={async () => {
              try {
                await setDoc(doc(db, 'users', user.uid), { diagnosticProgress: null }, { merge: true });
                setUser({ ...user, diagnosticProgress: undefined });
                setCurrentPage('home');
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
              }
            }}
          />
        )}
        {currentPage === 'appointment' && user && (
          <Appointment 
            key="appointment" 
            initialData={appointmentData}
            onNext={async (data) => {
              const appointmentId = appointmentData?.id || doc(collection(db, 'appointments')).id;
              const payload = {
                ...data,
                uid: user.uid,
                diagnosticData,
                createdAt: appointmentData?.createdAt || serverTimestamp()
              };
              
              try {
                await setDoc(doc(db, 'appointments', appointmentId), payload);
                setCurrentPage('confirmation');
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `appointments/${appointmentId}`);
              }
            }} 
            onBack={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'confirmation' && (
          <Confirmation 
            key="confirmation" 
            appointmentData={appointmentData}
            onReset={() => {
              setCurrentPage('home');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
