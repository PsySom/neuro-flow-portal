import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PasswordStrength, validatePassword } from '@/components/ui/password-strength';
import { PasswordBreachService } from '@/services/password-breach.service';
import { AlertCircle, Shield } from 'lucide-react';

const PasswordChangeSection: React.FC = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Новые пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    // Check password strength
    const { score } = validatePassword(newPassword);
    if (score < 3) {
      toast({
        title: 'Слабый пароль',
        description: 'Для безопасности используйте более надёжный пароль.',
        variant: 'destructive',
      });
      return;
    }

    setIsChanging(true);

    try {
      // Check if password has been breached
      const breachCheck = await PasswordBreachService.checkPassword(newPassword);
      if (breachCheck.isBreached) {
        toast({
          title: 'Небезопасный пароль',
          description: `Этот пароль был скомпрометирован в утечках данных${breachCheck.breachCount ? ` (${breachCheck.breachCount.toLocaleString()} раз)` : ''}. Используйте другой пароль для безопасности.`,
          variant: 'destructive',
        });
        setIsChanging(false);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Пароль изменён',
      });

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось изменить пароль',
        variant: 'destructive',
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Shield className="w-4 h-4" />
        <span>Изменить пароль</span>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="new-password">Новый пароль</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Введите новый пароль"
          />
          {newPassword && <PasswordStrength password={newPassword} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Повторите новый пароль</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите новый пароль"
          />
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>Пароли не совпадают</span>
            </div>
          )}
        </div>

        <Button onClick={handlePasswordChange} disabled={isChanging}>
          {isChanging ? 'Изменение...' : 'Изменить пароль'}
        </Button>
      </div>
    </div>
  );
};

export default PasswordChangeSection;
