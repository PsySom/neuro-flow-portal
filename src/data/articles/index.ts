import { depressionTableOfContents, depressionArticleData, depressionRecommendedTools } from './depression';
import { cyclesTableOfContents, cyclesArticleData, cyclesRecommendedTools } from './cycles';
import { selfEsteemTableOfContents, selfEsteemArticleData, selfEsteemRecommendedTools } from './self-esteem';

export const getArticleTableOfContents = (articleId?: number) => {
  if (articleId === 3) {
    return cyclesTableOfContents;
  }
  if (articleId === 4) {
    return selfEsteemTableOfContents;
  }
  
  return depressionTableOfContents;
};

export const getArticleData = (articleId?: number) => {
  if (articleId === 3) {
    return cyclesArticleData;
  }
  if (articleId === 4) {
    return selfEsteemArticleData;
  }

  return depressionArticleData;
};

export const getRecommendedTools = (articleId?: number) => {
  if (articleId === 3) {
    return cyclesRecommendedTools;
  }
  if (articleId === 4) {
    return selfEsteemRecommendedTools;
  }
  
  return depressionRecommendedTools;
};