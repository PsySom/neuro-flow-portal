import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface SocialSupportScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const SocialSupportScreen: React.FC<SocialSupportScreenProps> = ({ onNext, onBack }) => {
  const [relationshipsQuality, setRelationshipsQuality] = useState('');
  const [lonelinessFrequency, setLonelinessFrequency] = useState('');
  const [supportSources, setSupportSources] = useState<string[]>([]);
  const [supportBarriers, setSupportBarriers] = useState<string[]>([]);
  const [lonelinessTriggers, setLonelinessTriggers] = useState<string[]>([]);

  const supportSourceOptions = [
    { id: 'family', title: 'Семья (родители, партнер, дети)', emoji: '👨‍👩‍👧‍👦' },
    { id: 'friends', title: 'Близкие друзья', emoji: '👥' },
    { id: 'colleagues', title: 'Коллеги по работе', emoji: '💼' },
    { id: 'therapist', title: 'Психолог или психиатр', emoji: '🧠' },
    { id: 'doctor', title: 'Врач или другой специалист', emoji: '👨‍⚕️' },
    { id: 'online', title: 'Онлайн-сообщества и форумы', emoji: '🌐' },
    { id: 'social-media', title: 'Знакомые в соцсетях', emoji: '📱' },
    { id: 'religious', title: 'Религиозная община или духовный наставник', emoji: '🙏' },
    { id: 'content', title: 'Книги, подкасты, контент', emoji: '📚' },
    { id: 'none', title: 'Ни к кому - предпочитаю справляться сам(а)', emoji: '😔' }
  ];

  const barrierOptions = [
    { id: 'independence', title: 'Привык(ла) справляться самостоятельно', emoji: '💪' },
    { id: 'burden', title: 'Страх быть обузой для других', emoji: '😰' },
    { id: 'shame', title: 'Стыжусь своих проблем', emoji: '😳' },
    { id: 'cant-ask', title: 'Не умею просить о помощи', emoji: '🤐' },
    { id: 'trust', title: 'Не доверяю людям свои переживания', emoji: '👥' },
    { id: 'understanding', title: 'Кажется, что никто не поймет', emoji: '😔' },
    { id: 'judgment', title: 'Боюсь осуждения или критики', emoji: '⚡' },
    { id: 'no-people', title: 'Просто нет подходящих людей рядом', emoji: '🚫' },
    { id: 'online-easier', title: 'Легче найти поддержку онлайн, чем вживую', emoji: '📱' }
  ];

  const triggerOptions = [
    { id: 'evening', title: 'Вечером или перед сном', emoji: '🌙' },
    { id: 'holidays', title: 'На праздниках и важных событиях', emoji: '🎉' },
    { id: 'difficulties', title: 'Когда переживаю трудности', emoji: '😔' },
    { id: 'crowds', title: 'В больших компаниях людей', emoji: '👥' },
    { id: 'work', title: 'На работе или учебе', emoji: '💼' },
    { id: 'social-media', title: 'Видя чужую "идеальную" жизнь в соцсетях', emoji: '📱' },
    { id: 'home', title: 'Дома в тишине', emoji: '🏠' },
    { id: 'decisions', title: 'Когда нужно принимать важные решения', emoji: '🎯' },
    { id: 'success', title: 'Когда хочется поделиться успехами', emoji: '🏆' }
  ];

  const toggleSelection = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => {
      if (prev.includes(item)) {
        return prev.filter(id => id !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSubmit = () => {
    onNext({
      relationshipsQuality,
      lonelinessFrequency,
      supportSources,
      supportBarriers,
      lonelinessTriggers
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={68.75} className="mb-4" />
        <p className="text-sm text-gray-500">11 из 16 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Социальная поддержка и связи
      </h2>
      <p className="text-gray-600 mb-6">
        Понимание ваших социальных связей поможет нам предложить подходящие стратегии поддержки
      </p>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как вы оцениваете качество ваших близких отношений?
          </Label>
          <RadioGroup value={relationshipsQuality} onValueChange={setRelationshipsQuality}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="strong" id="rel-strong" />
              <Label htmlFor="rel-strong">У меня есть крепкие, поддерживающие отношения</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="rel-good" />
              <Label htmlFor="rel-good">В целом хорошие отношения, но не всегда чувствую поддержку</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="superficial" id="rel-superficial" />
              <Label htmlFor="rel-superficial">Отношения поверхностные, мало кому могу довериться</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lonely" id="rel-lonely" />
              <Label htmlFor="rel-lonely">Чувствую себя одиноко даже среди людей</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как часто вы чувствуете одиночество?
          </Label>
          <RadioGroup value={lonelinessFrequency} onValueChange={setLonelinessFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="lonely-never" />
              <Label htmlFor="lonely-never">Практически никогда - чувствую связь с окружающими</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="lonely-sometimes" />
              <Label htmlFor="lonely-sometimes">Иногда, в определенных ситуациях</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="often" id="lonely-often" />
              <Label htmlFor="lonely-often">Часто чувствую себя одиноко</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="constantly" id="lonely-constantly" />
              <Label htmlFor="lonely-constantly">Постоянно ощущаю одиночество и изоляцию</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            К кому вы обычно обращаетесь за поддержкой? (несколько вариантов)
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {supportSourceOptions.map((source) => (
              <div key={source.id} className="flex items-center space-x-2">
                <Checkbox
                  id={source.id}
                  checked={supportSources.includes(source.id)}
                  onCheckedChange={() => toggleSelection(source.id, setSupportSources)}
                />
                <Label htmlFor={source.id} className="flex items-center space-x-2">
                  <span>{source.emoji}</span>
                  <span>{source.title}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Что мешает вам обращаться за поддержкой? (несколько вариантов)
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {barrierOptions.map((barrier) => (
              <div key={barrier.id} className="flex items-center space-x-2">
                <Checkbox
                  id={barrier.id}
                  checked={supportBarriers.includes(barrier.id)}
                  onCheckedChange={() => toggleSelection(barrier.id, setSupportBarriers)}
                />
                <Label htmlFor={barrier.id} className="flex items-center space-x-2">
                  <span>{barrier.emoji}</span>
                  <span>{barrier.title}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            В каких ситуациях вы чувствуете себя наиболее одиноко? (несколько вариантов)
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {triggerOptions.map((trigger) => (
              <div key={trigger.id} className="flex items-center space-x-2">
                <Checkbox
                  id={trigger.id}
                  checked={lonelinessTriggers.includes(trigger.id)}
                  onCheckedChange={() => toggleSelection(trigger.id, setLonelinessTriggers)}
                />
                <Label htmlFor={trigger.id} className="flex items-center space-x-2">
                  <span>{trigger.emoji}</span>
                  <span>{trigger.title}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!relationshipsQuality || !lonelinessFrequency}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default SocialSupportScreen;