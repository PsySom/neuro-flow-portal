
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth as useAuth } from '@/contexts/SupabaseAuthContext';
import UserMenu from '@/components/dashboard/UserMenu';

const UserActions: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();


  if (isAuthenticated) {
    return (
      <>
        <Button 
          className="text-white"
          style={{ 
            background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
          }}
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Дашборд
        </Button>
        <UserMenu />
      </>
    );
  }

  return (
    <>
      <Button 
        variant="ghost" 
        className="text-gray-700 dark:text-gray-300"
        style={{ 
          '--hover-color': `hsl(var(--psybalans-primary))`
        } as React.CSSProperties}
        onClick={() => navigate('/auth')}
      >
        Вход
      </Button>
      <Button 
        className="text-white"
        style={{ 
          background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
        }}
        onClick={() => navigate('/auth')}
      >
        Регистрация
      </Button>
    </>
  );
};

export default UserActions;
