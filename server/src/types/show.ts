export interface Show {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  rating: number;
  vikiRating: number;
  vikiId: string | null;
  mdlRating: number;
  mdlId: string | null;
  mdlHref: string | null;
  year?: string;
}

export interface IMDbResponse {
  shows: Show[];
  totalResults: string;
}

export interface SearchResponse {
  shows: Show[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
} 
