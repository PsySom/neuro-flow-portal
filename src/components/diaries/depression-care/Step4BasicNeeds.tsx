
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step4BasicNeedsProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step4BasicNeeds: React.FC<Step4BasicNeedsProps> = ({ 
  data, 
  onDataChange, 
  onNext, 
  onPrev 
}) => {
  const handleNeedChange = (category: string, need: string, value: number) => {
    onDataChange('basicNeeds', {
      ...data.basicNeeds,
      [category]: {
        ...data.basicNeeds?.[category],
        [need]: value
      }
    });
  };

  const handleImprovementChange = (category: string, value: string) => {
    onDataChange('needsImprovement', {
      ...data.needsImprovement,
      [category]: value
    });
  };

  return (
    <div className="space-y-8">
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">
            🏠 Забота о базовых потребностях
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-purple-700">
            Оценка каждого уровня от 1 (совсем не удовлетворено) до 10 (полностью удовлетворено)
          </p>

          {/* Базовые физические потребности */}
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="text-pink-800 text-lg">
                Базовые физические потребности
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Сон и отдых</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'sleepQuality', label: 'Качество сна' },
                    { key: 'dailyRest', label: 'Количество отдыха в течение дня' },
                    { key: 'recoveryFeeling', label: 'Чувство восстановления' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.sleep?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('sleep', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.sleep?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Label>Что могу улучшить</Label>
                  <Input
                    value={data.needsImprovement?.sleep || ''}
                    onChange={(e) => handleImprovementChange('sleep', e.target.value)}
                    placeholder="Идеи для улучшения сна и отдыха..."
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Питание</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'mealRegularity', label: 'Регулярность приемов пищи' },
                    { key: 'nutritionQuality', label: 'Качество питания' },
                    { key: 'eatingPleasure', label: 'Удовольствие от еды' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.nutrition?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('nutrition', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.nutrition?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Label>Что могу улучшить</Label>
                  <Input
                    value={data.needsImprovement?.nutrition || ''}
                    onChange={(e) => handleImprovementChange('nutrition', e.target.value)}
                    placeholder="Идеи для улучшения питания..."
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Движение и активность</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'physicalActivity', label: 'Физическая активность' },
                    { key: 'freshAir', label: 'Время на свежем воздухе' },
                    { key: 'bodyConnection', label: 'Связь с телом' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.movement?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('movement', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.movement?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Label>Что могу улучшить</Label>
                  <Input
                    value={data.needsImprovement?.movement || ''}
                    onChange={(e) => handleImprovementChange('movement', e.target.value)}
                    placeholder="Идеи для улучшения движения и активности..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Безопасность и комфорт */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 text-lg">
                Безопасность и комфорт
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Эмоциональная безопасность</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'homeSafety', label: 'Чувство безопасности дома' },
                    { key: 'environmentStability', label: 'Стабильность окружения' },
                    { key: 'authenticity', label: 'Возможность быть собой' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.safety?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('safety', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.safety?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Финансовая стабильность</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'futureConfidence', label: 'Уверенность в завтрашнем дне' },
                    { key: 'basicNeedsCoverage', label: 'Возможность покрывать базовые нужды' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.financial?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('financial', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.financial?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Социальные потребности */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">
                Социальные потребности
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Близкие отношения</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'relationshipQuality', label: 'Качество отношений с близкими' },
                    { key: 'understanding', label: 'Чувство понимания' },
                    { key: 'emotionalSupport', label: 'Эмоциональная поддержка' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.social?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('social', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.social?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Принадлежность</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'communityBelonging', label: 'Чувство принадлежности к сообществу' },
                    { key: 'helpingOthers', label: 'Возможность помогать другим' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <div className="mt-1 space-y-1">
                        <Slider
                          value={[data.basicNeeds?.belonging?.[key] || 5]}
                          onValueChange={(value) => handleNeedChange('belonging', key, value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-600 text-center">
                          {data.basicNeeds?.belonging?.[key] || 5}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Планирование заботы о потребностях */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 text-lg">
                🎯 Планирование заботы о потребностях
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Три потребности, которые нуждаются в особом внимании</Label>
                <div className="space-y-3 mt-2">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="space-y-2">
                      <Label className="text-sm">Потребность #{num}</Label>
                      <Input
                        value={data.priorityNeeds?.[`need${num}`] || ''}
                        onChange={(e) => onDataChange('priorityNeeds', {
                          ...data.priorityNeeds,
                          [`need${num}`]: e.target.value
                        })}
                        placeholder={`Потребность ${num}...`}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Маленький шаг сегодня</Label>
                          <Input
                            value={data.priorityNeeds?.[`need${num}Today`] || ''}
                            onChange={(e) => onDataChange('priorityNeeds', {
                              ...data.priorityNeeds,
                              [`need${num}Today`]: e.target.value
                            })}
                            placeholder="Что сделаю сегодня..."
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Шаг на этой неделе</Label>
                          <Input
                            value={data.priorityNeeds?.[`need${num}Week`] || ''}
                            onChange={(e) => onDataChange('priorityNeeds', {
                              ...data.priorityNeeds,
                              [`need${num}Week`]: e.target.value
                            })}
                            placeholder="Что сделаю на неделе..."
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Кто может помочь</Label>
                          <Input
                            value={data.priorityNeeds?.[`need${num}Help`] || ''}
                            onChange={(e) => onDataChange('priorityNeeds', {
                              ...data.priorityNeeds,
                              [`need${num}Help`]: e.target.value
                            })}
                            placeholder="Кто поможет..."
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Помните:</strong> Забота о базовых потребностях — это не роскошь, 
              а необходимость. Маленькие изменения в удовлетворении основных потребностей 
              могут существенно улучшить ваше общее состояние.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button onClick={onNext}>
          Далее: Преодоление избегания
        </Button>
      </div>
    </div>
  );
};

export default Step4BasicNeeds;
