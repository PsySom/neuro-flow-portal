
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Mail, MessageCircle, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerSections = [
    {
      title: 'Платформа',
      links: [
        { label: 'О проекте', href: '/about' },
        { label: 'Как это работает', href: '/about#how-it-works' },
        { label: 'Научная основа', href: '/about#science' },
        { label: 'Безопасность', href: '/about#security' }
      ]
    },
    {
      title: 'Ресурсы',
      links: [
        { label: 'База знаний', href: '/knowledge' },
        { label: 'Упражнения', href: '/practices' },
        { label: 'Тесты', href: '/practices?type=tests' },
        { label: 'Медитации', href: '/practices?type=meditation' }
      ]
    },
    {
      title: 'Поддержка',
      links: [
        { label: 'Центр помощи', href: '/help' },
        { label: 'Связаться с нами', href: '/contact' },
        { label: 'Для специалистов', href: '/for-professionals' },
        { label: 'Сообщество', href: '/community' }
      ]
    },
    {
      title: 'Правовая информация',
      links: [
        { label: 'Политика конфиденциальности', href: '/privacy' },
        { label: 'Условия использования', href: '/terms' },
        { label: 'Согласие на обработку данных', href: '/data-policy' },
        { label: 'Отказ от ответственности', href: '/disclaimer' }
      ]
    }
  ];

  return (
    <footer className="bg-psybalans-muted dark:bg-psybalans-surface border-t border-psybalans-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Основной контент футера */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Логотип и описание */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-psybalans-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-psybalans-primary to-psybalans-secondary bg-clip-text text-transparent">
                PsyBalans
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Персональная экосистема психологического баланса на основе 
              нейронауки и искусственного интеллекта.
            </p>
            
            {/* Социальные сети */}
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="hover:bg-psybalans-primary/10">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-psybalans-primary/10">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-psybalans-primary/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-psybalans-primary/10">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Навигационные секции */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-psybalans-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Разделитель */}
        <div className="border-t border-psybalans-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 PsyBalans. Все права защищены.
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span>Сделано с </span>
              <span className="text-red-500">❤️</span>
              <span> для ментального здоровья</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Версия 1.0.0 • 
              <Link to="/changelog" className="text-psybalans-primary hover:text-psybalans-secondary ml-1">
                Что нового?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
