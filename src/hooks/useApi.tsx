export enum SearchType {
  all = "",
  movie = "movie",
  series = "series",
  episode = "episode",
}

export interface SearchResult {
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  imdbID: string;
}

export interface SearchError {
  Response: string;
  Error: string;
}

const useApi = () => {
  let url = "https://www.omdbapi.com/";
  let apiKey = "ce7aa1bf";

  const searchData = async (
    title: string,
    type: SearchType
  ): Promise<SearchResult[] | SearchError> => {
    const result = await fetch(
      `${url}?s=${encodeURI(title)}&type=${type}&apikey=${apiKey}&r=json`
    );
    const responseData = await result.json();

    if (responseData.Response === "False") {
      throw new Error(responseData.Error);
    }

    const searchResults: SearchResult[] = responseData.Search.map(
      (item: any) => ({
        Title: item.Title,
        Year: item.Year,
        Poster: item.Poster,
        Type: item.Type,
        imdbID: item.imdbID,
      })
    );

    return searchResults;
  };

  return {
    searchData,
  };
};

export default useApi;
