
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import ArticleTabContent from '../components/article/ArticleTabContent';
import ArticleHeader from '../components/article/ArticleHeader';
import { getArticleData } from '../data/articles';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // Определяем правильный articleId на основе переданного ID
  const getArticleId = (id: string | undefined) => {
    if (id === '2') return 2; // Депрессия
    if (id === '3') return 3; // Циклы 
    if (id === '4') return 4; // Самооценка
    if (id === '8') return 3; // Старая ссылка на циклы
    return parseInt(id || '0') || undefined;
  };

  const articleId = getArticleId(id);
  const article = getArticleData(articleId);

  useEffect(() => {
    setLikes(Math.floor(Math.random() * 100) + 50);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = () => {
    alert('Функция скачивания будет реализована в следующих версиях');
  };

  const handleShare = () => {
    if (!article) return;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
            <p className="text-gray-600 mb-6">К сожалению, запрашиваемая статья не существует или была удалена.</p>
            <Button onClick={() => navigate('/knowledge')}>
              Вернуться в базу знаний
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleHeader
          title={article.title}
          readTime={article.readTime}
          views={article.views}
          tags={article.tags}
          isLiked={isLiked}
          likes={likes}
          onLike={handleLike}
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <ArticleTabContent content={article.content} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
