interface Show {
  title: string;
  rating: number;
  source: string;
}

export function combineResults(imdbResults: Show[], mdlResults: Show[]): Show[] {
  const combined = [...imdbResults, ...mdlResults];

  // Remove duplicates based on title similarity
  const uniqueShows = combined.reduce<Show[]>((acc, current) => {
    const duplicate = acc.find((show) =>
      isSimilarTitle(show.title, current.title)
    );

    if (!duplicate) {
      acc.push(current);
    } else if (
      current.source === 'MyDramaList' &&
      duplicate.source === 'IMDb'
    ) {
      // Prefer MyDramaList for Asian content
      const index = acc.indexOf(duplicate);
      acc[index] = current;
    }

    return acc;
  }, []);

  return uniqueShows.sort((a, b) => b.rating - a.rating);
}

function isSimilarTitle(title1: string, title2: string): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const t1 = normalize(title1);
  const t2 = normalize(title2);
  return t1 === t2 || t1.includes(t2) || t2.includes(t1);
} 
