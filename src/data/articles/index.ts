import { depressionTableOfContents, depressionArticleData, depressionRecommendedTools } from './depression';
import { cyclesTableOfContents, cyclesArticleData, cyclesRecommendedTools } from './cycles';
import { selfEsteemTableOfContents, selfEsteemArticleData, selfEsteemRecommendedTools } from './self-esteem';

export const getArticleTableOfContents = (articleId?: number) => {
  switch (articleId) {
    case 2:
      return depressionTableOfContents;
    case 3:
      return cyclesTableOfContents;
    case 4:
      return selfEsteemTableOfContents;
    default:
      return depressionTableOfContents;
  }
};

export const getArticleData = (articleId?: number) => {
  switch (articleId) {
    case 2:
      return depressionArticleData;
    case 3:
      return cyclesArticleData;
    case 4:
      return selfEsteemArticleData;
    default:
      return undefined; // Возвращаем undefined для неизвестных ID
  }
};

export const getRecommendedTools = (articleId?: number) => {
  switch (articleId) {
    case 2:
      return depressionRecommendedTools;
    case 3:
      return cyclesRecommendedTools;
    case 4:
      return selfEsteemRecommendedTools;
    default:
      return [];
  }
};