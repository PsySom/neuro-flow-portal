
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Palette, Type, Settings as SettingsIcon, Monitor, Sun, Moon } from 'lucide-react';
import { usePersonalization, AccentColor, FontSize, Theme } from '@/contexts/PersonalizationContext';
import { MagicDesignControls } from './MagicDesignControls';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { settings, updateSettings, applySettings } = usePersonalization();

  const accentColors: { value: AccentColor; label: string; color: string; description: string }[] = [
    { value: 'emerald', label: 'Изумрудный', color: 'bg-emerald-500', description: 'Классический зеленый' },
    { value: 'blue', label: 'Синий', color: 'bg-blue-500', description: 'Океанские волны' },
    { value: 'purple', label: 'Фиолетовый', color: 'bg-purple-500', description: 'Мистический лавандовый' },
    { value: 'pink', label: 'Розовый', color: 'bg-pink-500', description: 'Нежная роза' },
    { value: 'orange', label: 'Оранжевый', color: 'bg-orange-500', description: 'Теплый закат' },
    { value: 'teal', label: 'Бирюзовый', color: 'bg-teal-500', description: 'Спокойная вода' },
    { value: 'sage', label: 'Шалфей & Коралл', color: 'bg-green-400', description: 'Природная гармония' },
    { value: 'lavender', label: 'Лаванда & Золото', color: 'bg-purple-400', description: 'Элегантность и тепло' },
    { value: 'sky', label: 'Небо & Абрикос', color: 'bg-sky-400', description: 'Утренняя свежесть' },
    { value: 'mint', label: 'Мята & Слива', color: 'bg-emerald-400', description: 'Освежающий контраст' },
    { value: 'rose', label: 'Роза & Индиго', color: 'bg-rose-400', description: 'Романтика и глубина' },
    { value: 'ice', label: 'Лед & Неон', color: 'bg-cyan-400', description: 'Современная прохлада' },
  ];

  const fontSizes: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'Маленький', description: '14px - Компактный размер' },
    { value: 'medium', label: 'Средний', description: '16px - Стандартный размер' },
    { value: 'large', label: 'Большой', description: '18px - Увеличенный размер' },
  ];

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Светлая', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Тёмная', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'Системная', icon: <Monitor className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Настройки</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">Дизайн</TabsTrigger>
            <TabsTrigger value="personalization">Персонализация</TabsTrigger>
            <TabsTrigger value="general">Общие</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <MagicDesignControls />
          </TabsContent>

          <TabsContent value="personalization" className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Тема */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>Тема</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <Button
                      key={theme.value}
                      variant={settings.theme === theme.value ? "default" : "outline"}
                      className="flex items-center space-x-2 h-12"
                      onClick={() => updateSettings({ theme: theme.value })}
                    >
                      {theme.icon}
                      <span>{theme.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Акцентный цвет */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Акцентный цвет</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {accentColors.map((color) => (
                    <div
                      key={color.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        settings.accentColor === color.value
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateSettings({ accentColor: color.value })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full ${color.color} shadow-sm`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{color.label}</div>
                          <div className="text-xs text-muted-foreground">{color.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Размер шрифта */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span>Размер шрифта</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {fontSizes.map((size) => (
                    <div
                      key={size.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        settings.fontSize === size.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateSettings({ fontSize: size.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{size.label}</div>
                          <div className="text-sm text-muted-foreground">{size.description}</div>
                        </div>
                        <div
                          className="text-xl font-medium"
                          style={{
                            fontSize: size.value === 'small' ? '14px' : size.value === 'medium' ? '16px' : '18px'
                          }}
                        >
                          Аа
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Предварительный просмотр */}
            <Card>
              <CardHeader>
                <CardTitle>Предварительный просмотр</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg space-y-3 bg-card">
                  <h3 className="font-semibold">Пример заголовка</h3>
                  <p className="text-muted-foreground">
                    Это пример текста с применёнными настройками. 
                    Здесь вы можете увидеть, как будет выглядеть интерфейс 
                    с выбранными параметрами.
                  </p>
                  <Button size="sm">Пример кнопки</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Общие настройки приложения будут здесь...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Настройки уведомлений будут здесь...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
