
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ChevronDown, 
  X
} from 'lucide-react';
import { 
  contentTypes, 
  therapyMethods, 
  problems, 
  objects, 
  subObjects,
  practiceCategories 
} from '@/constants/practicesConstants';

interface PracticesSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTherapyMethods: string[];
  setSelectedTherapyMethods: (methods: string[]) => void;
  selectedProblems: string[];
  setSelectedProblems: (problems: string[]) => void;
  selectedObjects: string[];
  setSelectedObjects: (objects: string[]) => void;
  selectedSubObjects: string[];
  setSelectedSubObjects: (subObjects: string[]) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isFiltersExpanded: boolean;
  setIsFiltersExpanded: (expanded: boolean) => void;
  activeFiltersCount: number;
  clearAllFilters: () => void;
  handleMultiSelectChange: (value: string, selectedArray: string[], setFunction: (arr: string[]) => void) => void;
}

const PracticesSearchFilters: React.FC<PracticesSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedTherapyMethods,
  setSelectedTherapyMethods,
  selectedProblems,
  setSelectedProblems,
  selectedObjects,
  setSelectedObjects,
  selectedSubObjects,
  setSelectedSubObjects,
  selectedDuration,
  setSelectedDuration,
  selectedLevel,
  setSelectedLevel,
  selectedCategory,
  setSelectedCategory,
  isFiltersExpanded,
  setIsFiltersExpanded,
  activeFiltersCount,
  clearAllFilters,
  handleMultiSelectChange
}) => {
  // Get available sub-objects based on selected main object
  const getAvailableSubObjects = () => {
    if (selectedObjects.length === 0) return [];
    
    const allSubObjects = selectedObjects.reduce((acc, objectId) => {
      const subs = subObjects[objectId as keyof typeof subObjects] || [];
      return [...acc, ...subs];
    }, [] as typeof subObjects.thoughts);
    
    return allSubObjects;
  };

  const availableSubObjects = getAvailableSubObjects();

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Умный поиск</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} фильтр{activeFiltersCount > 1 ? 'ов' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-2" />
                Очистить все
              </Button>
            )}
          </div>
        </div>
        
        {/* Основная строка поиска */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск по названию, проблеме..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            Расширенный поиск
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Основные фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="По типу" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="По категории" />
            </SelectTrigger>
            <SelectContent>
              {practiceCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedObjects.length > 0 ? selectedObjects[0] : 'all'} onValueChange={(value) => {
            if (value === 'all') {
              setSelectedObjects([]);
              setSelectedSubObjects([]);
            } else {
              setSelectedObjects([value]);
              setSelectedSubObjects([]);
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="По объекту воздействия" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой объект</SelectItem>
              {objects.map((object) => (
                <SelectItem key={object.id} value={object.id}>
                  {object.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedSubObjects.length > 0 ? selectedSubObjects[0] : 'all'} 
            onValueChange={(value) => {
              if (value === 'all') {
                setSelectedSubObjects([]);
              } else {
                setSelectedSubObjects([value]);
              }
            }}
            disabled={availableSubObjects.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="По подобъекту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой подобъект</SelectItem>
              {availableSubObjects.map((subObject) => (
                <SelectItem key={subObject.id} value={subObject.id}>
                  {subObject.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProblems.length > 0 ? selectedProblems[0] : 'all'} onValueChange={(value) => {
            if (value === 'all') {
              setSelectedProblems([]);
            } else {
              setSelectedProblems([value]);
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Проблемы и запросы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любая проблема</SelectItem>
              {problems.map((problem) => (
                <SelectItem key={problem.id} value={problem.id}>
                  {problem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Вторая строка основных фильтров */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
          <Select value={selectedTherapyMethods.length > 0 ? selectedTherapyMethods[0] : 'all'} onValueChange={(value) => {
            if (value === 'all') {
              setSelectedTherapyMethods([]);
            } else {
              setSelectedTherapyMethods([value]);
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Методы терапии" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой метод</SelectItem>
              {therapyMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Расширенные фильтры */}
        <Collapsible open={isFiltersExpanded} onOpenChange={setIsFiltersExpanded}>
          <CollapsibleContent className="space-y-6 pt-4 border-t">
            {/* Время выполнения и уровень сложности */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Время выполнения
                </h4>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Время выполнения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любое время</SelectItem>
                    <SelectItem value="2-5">2-5 минут</SelectItem>
                    <SelectItem value="10-20">10-20 минут</SelectItem>
                    <SelectItem value="30+">30+ минут</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Уровень сложности
                </h4>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Уровень сложности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любой уровень</SelectItem>
                    <SelectItem value="easy">Начинающий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="advanced">Продвинутый</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Multiple select filters for advanced users */}
            <div className="space-y-6">
              {/* Множественный выбор методов терапии */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Методы терапии (множественный выбор)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {therapyMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={method.id}
                        checked={selectedTherapyMethods.includes(method.id)}
                        onCheckedChange={() => handleMultiSelectChange(method.id, selectedTherapyMethods, setSelectedTherapyMethods)}
                      />
                      <label htmlFor={method.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {method.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Множественный выбор проблем */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Проблемы и запросы (множественный выбор)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {problems.map((problem) => (
                    <div key={problem.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={problem.id}
                        checked={selectedProblems.includes(problem.id)}
                        onCheckedChange={() => handleMultiSelectChange(problem.id, selectedProblems, setSelectedProblems)}
                      />
                      <label htmlFor={problem.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {problem.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Множественный выбор объектов воздействия */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Объект воздействия (множественный выбор)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objects.map((object) => (
                    <div key={object.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={object.id}
                        checked={selectedObjects.includes(object.id)}
                        onCheckedChange={() => {
                          handleMultiSelectChange(object.id, selectedObjects, setSelectedObjects);
                          // Clear sub-objects when main object selection changes
                          if (!selectedObjects.includes(object.id)) {
                            setSelectedSubObjects([]);
                          }
                        }}
                      />
                      <label htmlFor={object.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {object.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Множественный выбор подобъектов воздействия */}
              {availableSubObjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Подобъект воздействия (множественный выбор)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSubObjects.map((subObject) => (
                      <div key={subObject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subObject.id}
                          checked={selectedSubObjects.includes(subObject.id)}
                          onCheckedChange={() => handleMultiSelectChange(subObject.id, selectedSubObjects, setSelectedSubObjects)}
                        />
                        <label htmlFor={subObject.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {subObject.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default PracticesSearchFilters;
