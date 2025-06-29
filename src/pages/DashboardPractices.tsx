
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AdaptiveNavigation from '@/components/navigation/AdaptiveNavigation';
import DashboardBottomNav from '@/components/dashboard/DashboardBottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PracticesSearchFilters from '../components/practices/PracticesSearchFilters';
import PracticeContentCard from '../components/practices/PracticeContentCard';
import CreatePracticeDialog from '../components/practices/CreatePracticeDialog';
import PracticeDetailModal from '../components/practices/PracticeDetailModal';
import { contentTypes, allContent } from '@/constants/practicesConstants';
import { useDashboardScroll } from '@/hooks/useDashboardScroll';

const DashboardPractices = () => {
  useDashboardScroll();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTherapyMethods, setSelectedTherapyMethods] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedSubObjects, setSelectedSubObjects] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = (title: string, type: string = 'практику') => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - PsyBalans`,
        text: `Попробуйте эту ${type}: ${title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Ссылка скопирована",
        description: `Ссылка на ${type} "${title}" скопирована в буфер обмена`,
      });
    }
  };

  const handleOpenDetail = (item: any) => {
    setSelectedPractice(item);
    setIsDetailModalOpen(true);
  };

  const handleMultiSelectChange = (value: string, selectedArray: string[], setFunction: (arr: string[]) => void) => {
    if (selectedArray.includes(value)) {
      setFunction(selectedArray.filter(item => item !== value));
    } else {
      setFunction([...selectedArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedTherapyMethods([]);
    setSelectedProblems([]);
    setSelectedObjects([]);
    setSelectedSubObjects([]);
    setSelectedDuration('all');
    setSelectedLevel('all');
    setSelectedCategory('all');
  };

  // Фильтрация контента
  const filteredContent = allContent.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    const matchesTherapyMethods = selectedTherapyMethods.length === 0 || 
      item.therapyMethods.some(method => selectedTherapyMethods.includes(method));
    
    const matchesProblems = selectedProblems.length === 0 || 
      item.problems.some(problem => selectedProblems.includes(problem));
    
    const matchesObjects = selectedObjects.length === 0 || 
      item.objects.some(object => selectedObjects.includes(object));
    
    const matchesDuration = selectedDuration === 'all' || 
      (selectedDuration === '2-5' && parseInt(item.duration) <= 5) ||
      (selectedDuration === '10-20' && parseInt(item.duration) >= 10 && parseInt(item.duration) <= 20) ||
      (selectedDuration === '30+' && parseInt(item.duration) >= 30);
    
    const matchesLevel = selectedLevel === 'all' || 
      (selectedLevel === 'easy' && item.level === 'Легко') ||
      (selectedLevel === 'medium' && item.level === 'Средне') ||
      (selectedLevel === 'advanced' && item.level === 'Продвинутый');
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    const matchesSubObjects = true;

    return matchesSearch && matchesType && matchesTherapyMethods && 
           matchesProblems && matchesObjects && matchesSubObjects &&
           matchesDuration && matchesLevel && matchesCategory;
  });

  const activeFiltersCount = [
    selectedType !== 'all' ? 1 : 0,
    selectedTherapyMethods.length,
    selectedProblems.length,
    selectedObjects.length,
    selectedSubObjects.length,
    selectedDuration !== 'all' ? 1 : 0,
    selectedLevel !== 'all' ? 1 : 0,
    selectedCategory !== 'all' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      <DashboardHeader />
      <AdaptiveNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок и введение */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            400+ научно обоснованных практик для любой ситуации
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Знания без практики остаются теорией. Наша библиотека содержит тщательно отобранные и адаптированные 
            упражнения из различных терапевтических традиций. Каждая практика снабжена научным обоснованием, 
            пошаговыми инструкциями и рекомендациями по применению.
          </p>
        </div>

        {/* Поиск и фильтры */}
        <PracticesSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedTherapyMethods={selectedTherapyMethods}
          setSelectedTherapyMethods={setSelectedTherapyMethods}
          selectedProblems={selectedProblems}
          setSelectedProblems={setSelectedProblems}
          selectedObjects={selectedObjects}
          setSelectedObjects={setSelectedObjects}
          selectedSubObjects={selectedSubObjects}
          setSelectedSubObjects={setSelectedSubObjects}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isFiltersExpanded={isFiltersExpanded}
          setIsFiltersExpanded={setIsFiltersExpanded}
          activeFiltersCount={activeFiltersCount}
          clearAllFilters={clearAllFilters}
          handleMultiSelectChange={handleMultiSelectChange}
        />

        {/* Результаты поиска */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Найдено: {filteredContent.length} {filteredContent.length === 1 ? 'результат' : filteredContent.length < 5 ? 'результата' : 'результатов'}
            </h2>
            <div className="flex items-center space-x-2">
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">По релевантности</SelectItem>
                  <SelectItem value="popular">По популярности</SelectItem>
                  <SelectItem value="duration">По времени</SelectItem>
                  <SelectItem value="level">По сложности</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Карточки контента */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredContent.map((item) => (
            <PracticeContentCard
              key={item.id}
              item={item}
              handleShare={handleShare}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
                <p className="text-sm">
                  Попробуйте изменить параметры поиска или очистить фильтры
                </p>
              </div>
              <Button onClick={clearAllFilters} variant="outline">
                Очистить все фильтры
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA секция */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Готовы начать свой путь к балансу?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Создайте персональную библиотеку практик, отслеживайте прогресс и получайте 
              рекомендации на основе ваших уникальных потребностей.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Создать аккаунт
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Узнать больше
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <DashboardBottomNav />
      <CreatePracticeDialog />
      <PracticeDetailModal 
        item={selectedPractice}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPractices;
