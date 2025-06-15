
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contentTypes, therapyMethods, problems, objects, subObjects, practiceCategories } from '@/constants/practicesConstants';

interface TestFields {
  instructions: string;
  questions: string[];
  keys: string;
  responseFormat: string;
}

const CreatePracticeDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [selectedObject, setSelectedObject] = useState('');
  const [selectedSubObject, setSelectedSubObject] = useState('');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedTherapyMethods, setSelectedTherapyMethods] = useState<string[]>([]);
  const [testFields, setTestFields] = useState<TestFields>({
    instructions: '',
    questions: [''],
    keys: '',
    responseFormat: ''
  });
  const { toast } = useToast();

  const availableSubObjects = selectedObject ? subObjects[selectedObject as keyof typeof subObjects] || [] : [];

  const handleProblemToggle = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleTherapyMethodToggle = (methodId: string) => {
    setSelectedTherapyMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const addQuestion = () => {
    setTestFields(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const updateQuestion = (index: number, value: string) => {
    setTestFields(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? value : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setTestFields(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!title || !description || !type) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля: название, описание и тип",
        variant: "destructive"
      });
      return;
    }

    // Здесь будет логика сохранения
    console.log('Saving practice:', {
      title,
      description,
      duration,
      level,
      type,
      category,
      selectedObject,
      selectedSubObject,
      selectedProblems,
      selectedTherapyMethods,
      ...(type === 'tests' && { testFields })
    });

    toast({
      title: "Успешно",
      description: "Упражнение создано",
    });

    // Сброс формы
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDuration('');
    setLevel('');
    setType('');
    setCategory('');
    setSelectedObject('');
    setSelectedSubObject('');
    setSelectedProblems([]);
    setSelectedTherapyMethods([]);
    setTestFields({
      instructions: '',
      questions: [''],
      keys: '',
      responseFormat: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-50"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать упражнение</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Название *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название упражнения"
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Продолжительность</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="5 мин"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите упражнение"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Тип *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.filter(t => t.id !== 'all').map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Уровень</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Легко">Легко</SelectItem>
                  <SelectItem value="Средне">Средне</SelectItem>
                  <SelectItem value="Продвинутый">Продвинутый</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Категория</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {practiceCategories.filter(c => c.id !== 'all').map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Объект</Label>
              <Select value={selectedObject} onValueChange={setSelectedObject}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите объект" />
                </SelectTrigger>
                <SelectContent>
                  {objects.map(obj => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Подобъект</Label>
              <Select 
                value={selectedSubObject} 
                onValueChange={setSelectedSubObject}
                disabled={!selectedObject || availableSubObjects.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите подобъект" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubObjects.map(subObj => (
                    <SelectItem key={subObj.id} value={subObj.id}>
                      {subObj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Проблемы</Label>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {problems.map(problem => (
                    <label key={problem.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProblems.includes(problem.id)}
                        onChange={() => handleProblemToggle(problem.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{problem.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Label>Терапевтические методы</Label>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {therapyMethods.map(method => (
                    <label key={method.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTherapyMethods.includes(method.id)}
                        onChange={() => handleTherapyMethodToggle(method.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {type === 'tests' && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Дополнительные поля для тестов</h3>
                
                <div>
                  <Label htmlFor="instructions">Инструкция</Label>
                  <Textarea
                    id="instructions"
                    value={testFields.instructions}
                    onChange={(e) => setTestFields(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Инструкция к тесту"
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Вопросы</Label>
                    <Button type="button" onClick={addQuestion} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {testFields.questions.map((question, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={question}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                        placeholder={`Вопрос ${index + 1}`}
                      />
                      {testFields.questions.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          size="sm"
                          variant="outline"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="keys">Ключи</Label>
                  <Textarea
                    id="keys"
                    value={testFields.keys}
                    onChange={(e) => setTestFields(prev => ({ ...prev, keys: e.target.value }))}
                    placeholder="Ключи для интерпретации результатов"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="responseFormat">Форма ответа</Label>
                  <Input
                    id="responseFormat"
                    value={testFields.responseFormat}
                    onChange={(e) => setTestFields(prev => ({ ...prev, responseFormat: e.target.value }))}
                    placeholder="Описание формы ответа"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePracticeDialog;
