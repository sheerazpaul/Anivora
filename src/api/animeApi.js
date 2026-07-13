import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(api(error.config)), 2000);
      });
    }
    return Promise.reject(error);
  }
);

export const animeApi = {
  getTopAnime: (filter = '', page = 1) =>
    api.get('/top/anime', { params: { filter: filter || undefined, page } }),

  getAnimeSearch: (query, page = 1) =>
    api.get('/anime', { params: { q: query, page } }),

  getAnimeDetails: (id) => api.get(`/anime/${id}`),

  getAnimeCharacters: (id) => api.get(`/anime/${id}/characters`),

  getAnimeRecommendations: (id) => api.get(`/anime/${id}/recommendations`),

  getAnimeEpisodes: (id, page = 1) => api.get(`/anime/${id}/episodes`, { params: { page } }),

  getAnimeReviews: (id, page = 1) => api.get(`/anime/${id}/reviews`, { params: { page } }),

  getAnimeByGenre: (genreId, page = 1) =>
    api.get('/anime', { params: { genres: genreId, page, order_by: 'members', sort: 'desc', limit: 25 } }),

  getGenres: () => api.get('/genres/anime'),

  getSeasonNow: (page = 1) => api.get('/seasons/now', { params: { page } }),

  getSeasonUpcoming: (page = 1) => api.get('/seasons/upcoming', { params: { page } }),

  getCharacterTop: (page = 1) => api.get('/characters', { params: { order_by: 'favorites', sort: 'desc', page } }),
};

export default api;
