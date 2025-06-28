
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { List, ChevronRight } from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  items, 
  activeSection, 
  onSectionClick 
}) => {
  return (
    <div className="sticky top-8">
      <Card className="bg-white border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Содержание</h3>
          </div>
          <ScrollArea className="h-96">
            <nav className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionClick(item.id)}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors hover:bg-emerald-50 flex items-center gap-2 ${
                    activeSection === item.id
                      ? 'bg-emerald-100 text-emerald-700 font-medium'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  <span className="line-clamp-2">{item.title}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableOfContents;
