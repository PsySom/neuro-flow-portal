
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
  Target, 
  Timer, 
  TrendingUp, 
  Filter, 
  ChevronDown, 
  X,
  Brain,
  Shield
} from 'lucide-react';
import { 
  contentTypes, 
  therapyMethods, 
  problems, 
  objects, 
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
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Расширенные фильтры
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Основная строка поиска */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск по проблеме, названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <Target className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Тип контента" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <Timer className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Время выполнения" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любое время</SelectItem>
              <SelectItem value="2-5">2-5 минут</SelectItem>
              <SelectItem value="10-20">10-20 минут</SelectItem>
              <SelectItem value="30+">30+ минут</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <TrendingUp className="w-4 h-4 mr-2" />
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

        {/* Расширенные фильтры */}
        <Collapsible open={isFiltersExpanded} onOpenChange={setIsFiltersExpanded}>
          <CollapsibleContent className="space-y-6 pt-4 border-t">
            {/* Методы терапии */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Методы терапии
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

            {/* Проблемы */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Проблемы и запросы
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

            {/* Объекты воздействия */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Объект воздействия
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {objects.map((object) => (
                  <div key={object.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={object.id}
                      checked={selectedObjects.includes(object.id)}
                      onCheckedChange={() => handleMultiSelectChange(object.id, selectedObjects, setSelectedObjects)}
                    />
                    <label htmlFor={object.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      {object.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Категории */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Категория практик
              </h4>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {practiceCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default PracticesSearchFilters;
