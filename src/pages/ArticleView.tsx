
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TableOfContents from '../components/article/TableOfContents';
import ArticleTabContent from '../components/article/ArticleTabContent';
import ArticleHeader from '../components/article/ArticleHeader';
import { getArticleData, getArticleTableOfContents } from '../data/articleData';

const ArticleView = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  const tableOfContents = getArticleTableOfContents();
  const article = getArticleData();

  useEffect(() => {
    setLikes(Math.floor(Math.random() * 100) + 50);
  }, []);

  // Scroll spy effect for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <TableOfContents 
              items={tableOfContents}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            <ArticleTabContent content={article.content} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
