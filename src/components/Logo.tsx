import { motion } from 'motion/react';
import memoireLogo from './logos/memoire_logo_v1.png';

export default function Logo({ size = 'large', showTagline = true }: { size?: 'small' | 'large', showTagline?: boolean }) {
  const isLarge = size === 'large';
  
  return (
    <div className={`flex flex-col items-center ${isLarge ? 'mb-12' : 'mb-0'}`}>
      <img 
        src={memoireLogo} 
        alt="L'Oréal Mémoire" 
        className={isLarge ? 'w-80 h-auto' : 'w-32 h-auto'}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
