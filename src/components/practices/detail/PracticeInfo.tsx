import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Users } from 'lucide-react';
import { contentTypes, therapyMethods, problems, objects, subObjects } from '@/constants/practicesConstants';

interface ContentItem {
  title: string;
  description: string;
  type: string;
  duration: string;
  level: string;
  participants: string;
  category: string;
  therapyMethods: string[];
  problems: string[];
  objects: string[];
  tags: string[];
  color: string;
}

interface PracticeInfoProps {
  item: ContentItem;
}

const PracticeInfo: React.FC<PracticeInfoProps> = ({ item }) => {
  const getMethodLabels = (methodIds: string[]) => {
    return methodIds.map(id => therapyMethods.find(m => m.id === id)?.label || id);
  };

  const getProblemLabels = (problemIds: string[]) => {
    return problemIds.map(id => problems.find(p => p.id === id)?.label || id);
  };

  const getObjectLabels = (objectIds: string[]) => {
    return objectIds.map(id => objects.find(o => o.id === id)?.label || id);
  };

  const getSubObjectLabels = (objectIds: string[]) => {
    const subObjectLabels: string[] = [];
    objectIds.forEach(objectId => {
      const objectSubObjects = subObjects[objectId as keyof typeof subObjects];
      if (objectSubObjects) {
        objectSubObjects.forEach(subObj => {
          if (!subObjectLabels.includes(subObj.label)) {
            subObjectLabels.push(subObj.label);
          }
        });
      }
    });
    return subObjectLabels;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Продолжительность: {item.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Участники: {item.participants}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Уровень: </span>
            <Badge variant="outline">{item.level}</Badge>
          </div>
          <div>
            <span className="text-sm text-gray-500">Тип: </span>
            <Badge variant="secondary">
              {contentTypes.find(t => t.id === item.type)?.label}
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{item.description}</p>

        {/* Терапевтические методы */}
        {item.therapyMethods.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Терапевтические методы:</h4>
            <div className="flex flex-wrap gap-2">
              {getMethodLabels(item.therapyMethods).map((method, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Проблемы */}
        {item.problems.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Проблемы:</h4>
            <div className="flex flex-wrap gap-2">
              {getProblemLabels(item.problems).map((problem, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {problem}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Объекты и подобъекты */}
        {item.objects.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Объекты:</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {getObjectLabels(item.objects).map((object, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {object}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {getSubObjectLabels(item.objects).map((subObject, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {subObject}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeInfo;