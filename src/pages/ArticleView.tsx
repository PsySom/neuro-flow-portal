
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleTabContent from '../components/article/ArticleTabContent';
import ArticleHeader from '../components/article/ArticleHeader';
import { getArticleData } from '../data/articleData';

const ArticleView = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const article = getArticleData();

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
    return <div>Статья не найдена</div>;
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
