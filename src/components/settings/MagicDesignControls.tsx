import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Palette, Sun, Moon, Sparkles, Focus, Box, Magnet, Zap } from 'lucide-react';

interface MagicDesignControlsProps {
  onClose?: () => void;
}

export const MagicDesignControls: React.FC<MagicDesignControlsProps> = ({ onClose }) => {
  const [scheme, setScheme] = useState('scheme1');
  const [intensity, setIntensity] = useState('max');
  const [isDark, setIsDark] = useState(false);
  const [effects, setEffects] = useState({
    particles: true,
    spotlight: false,
    tilt3d: false,
    magnetism: false,
    borderGlow: true
  });
  const [radius, setRadius] = useState([1.3]);
  const [shadowDistance, setShadowDistance] = useState([5]);
  const [shadowBlur, setShadowBlur] = useState([4]);
  const [shadowOpacity, setShadowOpacity] = useState([18]);

  // Initialize from localStorage
  useEffect(() => {
    const savedScheme = localStorage.getItem('magic-design-scheme') || 'scheme1';
    const savedIntensity = localStorage.getItem('magic-design-intensity') || 'max';
    const savedDark = localStorage.getItem('magic-design-dark') === 'true';
    
    setScheme(savedScheme);
    setIntensity(savedIntensity);
    setIsDark(savedDark);
  }, []);

  const schemes = [
    { id: 'scheme1', name: 'Green/Teal', color: 'from-green-400 to-teal-400' },
    { id: 'scheme2', name: 'Purple/Pink', color: 'from-purple-400 to-pink-400' },
    { id: 'scheme3', name: 'Orange/Warm', color: 'from-orange-400 to-red-400' },
    { id: 'scheme4', name: 'Rose/Red', color: 'from-rose-400 to-red-400' }
  ];

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('magic-design-scheme', scheme);
    localStorage.setItem('magic-design-intensity', intensity);
    localStorage.setItem('magic-design-dark', isDark.toString());
    
    // Apply to body
    document.body.setAttribute('data-scheme', scheme);
    document.body.setAttribute('data-intensity', intensity);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply CSS variables
    document.documentElement.style.setProperty('--radius', `${radius[0]}rem`);
    document.documentElement.style.setProperty('--shadow-distance', `${shadowDistance[0]}px`);
    document.documentElement.style.setProperty('--shadow-blur', `${shadowBlur[0]}px`);
    document.documentElement.style.setProperty('--shadow-opacity', `${shadowOpacity[0] / 100}`);
    
    // Apply effects to components
    document.body.classList.toggle('particle-effects', effects.particles);
    document.body.classList.toggle('spotlight-effect', effects.spotlight);
    document.body.classList.toggle('tilt-3d', effects.tilt3d);
    document.body.classList.toggle('magnetism', effects.magnetism);
    document.body.classList.toggle('border-glow', effects.borderGlow);
  }, [scheme, intensity, isDark, radius, shadowDistance, shadowBlur, shadowOpacity, effects]);

  const toggleEffect = (effect: keyof typeof effects) => {
    setEffects(prev => ({ ...prev, [effect]: !prev[effect] }));
  };

  return (
    <div className="w-full space-y-6 animate-slide-up-fade">
      <Card className="border-glow hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Magic Design System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Schemes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color Schemes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {schemes.map((s) => (
                <Button
                  key={s.id}
                  variant={scheme === s.id ? "default" : "outline"}
                  className={`h-16 bg-gradient-to-r ${s.color} text-white relative overflow-hidden hover-glow transition-all duration-300`}
                  onClick={() => setScheme(s.id)}
                >
                  <span className="font-medium z-10 relative">{s.name}</span>
                  {scheme === s.id && (
                    <div className="absolute inset-0 border-2 border-white/50 rounded-md animate-pulse-glow" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Theme
            </Label>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={setIsDark} />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Effects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'particles', label: 'Particle Effects', icon: Sparkles },
                { key: 'spotlight', label: 'Spotlight', icon: Focus },
                { key: 'tilt3d', label: '3D Tilt', icon: Box },
                { key: 'magnetism', label: 'Magnetism', icon: Magnet },
                { key: 'borderGlow', label: 'Border Glow', icon: Zap }
              ].map((effect) => (
                <div key={effect.key} className="flex items-center justify-between p-3 border rounded-lg hover-lift transition-all duration-200">
                  <Label className="flex items-center gap-2">
                    <effect.icon className="h-4 w-4" />
                    {effect.label}
                  </Label>
                  <Switch
                    checked={effects[effect.key as keyof typeof effects]}
                    onCheckedChange={() => toggleEffect(effect.key as keyof typeof effects)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Color Intensity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color Intensity</h3>
            <div className="flex gap-2">
              {['min', 'medium', 'max'].map((int) => (
                <Button
                  key={int}
                  variant={intensity === int ? "default" : "outline"}
                  onClick={() => setIntensity(int)}
                  className="flex-1"
                >
                  {int === 'min' ? '🔅 Min' : int === 'medium' ? '☀️ Medium' : '🔆 Max'}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Advanced Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Border Radius: {radius[0]}rem</Label>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Shadow Distance: {shadowDistance[0]}px</Label>
                <Slider
                  value={shadowDistance}
                  onValueChange={setShadowDistance}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Shadow Blur: {shadowBlur[0]}px</Label>
                <Slider
                  value={shadowBlur}
                  onValueChange={setShadowBlur}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Shadow Opacity: {shadowOpacity[0]}%</Label>
                <Slider
                  value={shadowOpacity}
                  onValueChange={setShadowOpacity}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MagicDesignControls;