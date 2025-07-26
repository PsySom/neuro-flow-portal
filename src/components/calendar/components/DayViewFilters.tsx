
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/contexts/ActivitiesContext';
import { getActivityTypeColorHex } from '@/utils/activityTypeColors';

interface DayViewFiltersProps {
  activities: Activity[];
  filteredTypes: Set<string>;
  onTypeFilterChange: (type: string, checked: boolean) => void;
}

const DayViewFilters: React.FC<DayViewFiltersProps> = ({
  activities,
  filteredTypes,
  onTypeFilterChange
}) => {
  // Показываем все возможные типы активностей постоянно
  const allActivityTypes = ['восстановление', 'нейтральная', 'смешанная', 'задача'];

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'восстановление': return 'Восстанавливающие';
      case 'нейтральная': return 'Нейтральные';
      case 'смешанная': return 'Смешанные';
      case 'задача': return 'Истощающие';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'восстановление': return 'bg-green-100 text-green-800';
      case 'нейтральная': return 'bg-gray-100 text-gray-800';
      case 'смешанная': return 'bg-yellow-100 text-yellow-800';
      case 'задача': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-3">
        <h3 className="text-xs font-medium mb-2 text-gray-700">Фильтры активностей</h3>
        <div className="space-y-2">
          {allActivityTypes.map((type) => {
            // Считаем количество активностей данного типа только среди переданных активностей
            const count = activities.filter(a => a.type === type).length;
            return (
              <div key={type} className="flex items-center space-x-2">
                <div 
                  className="relative w-3 h-3 cursor-pointer"
                  onClick={() => onTypeFilterChange(type, filteredTypes.has(type))}
                >
                  <div 
                    className={`w-3 h-3 rounded-full border-2`}
                    style={{ 
                      backgroundColor: !filteredTypes.has(type) ? getActivityTypeColorHex(type) : 'transparent',
                      borderColor: getActivityTypeColorHex(type)
                    }}
                  />
                  {!filteredTypes.has(type) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor={`filter-${type}`}
                  className="flex-1 flex items-center justify-between cursor-pointer"
                  onClick={() => onTypeFilterChange(type, filteredTypes.has(type))}
                >
                  <span className="text-xs text-gray-700">{getTypeDisplayName(type)}</span>
                  <Badge variant="secondary" className={`text-xs px-1 py-0 ${getTypeColor(type)}`}>
                    {count}
                  </Badge>
                </label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayViewFilters;
