
import React, { useState } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Palette, Type, Settings as SettingsIcon, Monitor } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [fontSize, setFontSize] = useState([16]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [borderRadius, setBorderRadius] = useState([8]);
  const [colorScheme, setColorScheme] = useState('emerald');
  const [fontFamily, setFontFamily] = useState('inter');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  const colorSchemes = [
    { value: 'emerald', label: 'Изумрудный', color: 'bg-emerald-500' },
    { value: 'blue', label: 'Синий', color: 'bg-blue-500' },
    { value: 'purple', label: 'Фиолетовый', color: 'bg-purple-500' },
    { value: 'pink', label: 'Розовый', color: 'bg-pink-500' },
    { value: 'orange', label: 'Оранжевый', color: 'bg-orange-500' },
    { value: 'teal', label: 'Бирюзовый', color: 'bg-teal-500' },
  ];

  const fonts = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'opensans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'poppins', label: 'Poppins' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Настройки</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personalization" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personalization">Персонализация</TabsTrigger>
            <TabsTrigger value="general">Общие</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>

          <TabsContent value="personalization" className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Цветовые схемы */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Цветовая схема</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {colorSchemes.map((scheme) => (
                    <Button
                      key={scheme.value}
                      variant={colorScheme === scheme.value ? "default" : "outline"}
                      className="flex items-center space-x-2 h-12"
                      onClick={() => setColorScheme(scheme.value)}
                    >
                      <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                      <span>{scheme.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Типографика */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span>Типографика</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Семейство шрифтов</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Размер шрифта: {fontSize[0]}px</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Высота строки: {lineHeight[0]}</Label>
                  <Slider
                    value={lineHeight}
                    onValueChange={setLineHeight}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Внешний вид */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>Внешний вид</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Радиус скругления: {borderRadius[0]}px</Label>
                  <Slider
                    value={borderRadius}
                    onValueChange={setBorderRadius}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Компактный режим</Label>
                    <p className="text-sm text-muted-foreground">
                      Уменьшает отступы и размеры элементов
                    </p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Анимации</Label>
                    <p className="text-sm text-muted-foreground">
                      Включает плавные переходы и анимации
                    </p>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
              </CardContent>
            </Card>

            {/* Предварительный просмотр */}
            <Card>
              <CardHeader>
                <CardTitle>Предварительный просмотр</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-4 border rounded-lg space-y-3"
                  style={{
                    fontSize: `${fontSize[0]}px`,
                    lineHeight: lineHeight[0],
                    borderRadius: `${borderRadius[0]}px`,
                  }}
                >
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
          <Button onClick={() => onOpenChange(false)}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
