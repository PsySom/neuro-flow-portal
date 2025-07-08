import { depressionTableOfContents, depressionArticleData, depressionRecommendedTools } from './depression';
import { cyclesTableOfContents, cyclesArticleData, cyclesRecommendedTools } from './cycles';

export const getArticleTableOfContents = (articleId?: number) => {
  if (articleId === 3) {
    return cyclesTableOfContents;
  }
  
  return depressionTableOfContents;
};

export const getArticleData = (articleId?: number) => {
  if (articleId === 3) {
    return cyclesArticleData;
  }

  return depressionArticleData;
};

export const getRecommendedTools = (articleId?: number) => {
  if (articleId === 3) {
    return cyclesRecommendedTools;
  }
  
  return depressionRecommendedTools;
};