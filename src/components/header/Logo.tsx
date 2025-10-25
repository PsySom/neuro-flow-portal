
import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Brain className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
      <span 
        className="text-2xl font-bold bg-clip-text text-transparent"
        style={{ 
          backgroundImage: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
        }}
      >
        PsyBalance
      </span>
    </Link>
  );
};

export default Logo;
