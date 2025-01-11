export interface Show {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  rating: number;
  vikiRating: number;
  vikiId: string | number | null;
  mdlRating: number;
  mdlId: string | number | null;
  year?: string;
}

export interface SearchResponse {
  shows: Show[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export interface RatingProps {
  source: 'IMDb' | 'Viki' | 'MDL';
  rating?: number;
  url?: string;
} 
