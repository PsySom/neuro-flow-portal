
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Mail, MessageCircle, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Платформа',
      links: [
        { label: 'О проекте', href: '#' },
        { label: 'Как это работает', href: '#' },
        { label: 'Научная основа', href: '#' },
        { label: 'Безопасность', href: '#' }
      ]
    },
    {
      title: 'Ресурсы',
      links: [
        { label: 'База знаний', href: '#' },
        { label: 'Упражнения', href: '#' },
        { label: 'Тесты', href: '#' },
        { label: 'Медитации', href: '#' }
      ]
    },
    {
      title: 'Поддержка',
      links: [
        { label: 'Центр помощи', href: '#' },
        { label: 'Связаться с нами', href: '#' },
        { label: 'Для специалистов', href: '#' },
        { label: 'Сообщество', href: '#' }
      ]
    },
    {
      title: 'Правовая информация',
      links: [
        { label: 'Политика конфиденциальности', href: '#' },
        { label: 'Условия использования', href: '#' },
        { label: 'Согласие на обработку данных', href: '#' },
        { label: 'Отказ от ответственности', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-emerald-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Основной контент футера */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Логотип и описание */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                PsyBalans
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Персональная экосистема психологического баланса на основе 
              нейронауки и искусственного интеллекта.
            </p>
            
            {/* Социальные сети */}
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="hover:bg-emerald-50">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-emerald-50">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-emerald-50">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-emerald-50">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Навигационные секции */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Разделитель */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 PsyBalans. Все права защищены.
            </div>
            
            <div className="text-sm text-gray-500">
              <span>Сделано с </span>
              <span className="text-red-500">❤️</span>
              <span> для ментального здоровья</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Версия 1.0.0 • 
              <a href="#" className="text-emerald-600 hover:text-emerald-700 ml-1">
                Что нового?
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
