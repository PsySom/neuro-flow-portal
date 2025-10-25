import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, UserCheck, UserX, Activity, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { backendUserService } from '@/services/backend-user.service';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface UsersManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsersManagementDialog: React.FC<UsersManagementDialogProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, active: 0, unconfirmed: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        backendUserService.getAllUsers(),
        backendUserService.getUserStats()
      ]);
      
      setUsers(usersData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    
    try {
      const exists = await backendUserService.checkUserExists(searchEmail);
      setSearchResult(exists ? 'found' : 'not_found');
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult('error');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
    } catch {
      return 'Некорректная дата';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Управление пользователями</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Просмотр и управление пользователями системы
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Всего</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Подтверждены</p>
                    <p className="text-2xl font-bold">{stats.confirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Активные</p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserX className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Неподтверждены</p>
                    <p className="text-2xl font-bold">{stats.unconfirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Поиск пользователя */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Поиск пользователя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Введите email для поиска..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                />
                <Button onClick={handleSearchUser} variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              {searchResult && (
                <div className={`p-3 rounded-lg ${
                  searchResult === 'found' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : searchResult === 'not_found'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {searchResult === 'found' && '✅ Пользователь найден'}
                  {searchResult === 'not_found' && '❌ Пользователь не найден'}
                  {searchResult === 'error' && '⚠️ Ошибка поиска'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Список пользователей */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Список пользователей</CardTitle>
              <Button onClick={loadData} variant="outline" size="sm">
                Обновить
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-sm text-muted-foreground">Загрузка...</div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <div className="text-sm text-muted-foreground">Пользователи не найдены</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Регистрация: {formatDate(user.created_at)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Последний вход: {formatDate(user.last_sign_in_at)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                            {user.email_confirmed_at ? "Подтвержден" : "Не подтвержден"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsersManagementDialog;