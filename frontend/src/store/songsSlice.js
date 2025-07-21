import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  songs: [],
  pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
  searchQuery: '',
  loading: false,
  error: null,
  isModalOpen: false,
  editingSong: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    fetchSongsRequest: (state) => { state.loading = true; state.error = null; },
    fetchSongsSuccess: (state, action) => {
      state.loading = false;
      state.songs = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
      };
    },
    fetchSongsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    createSongRequest: (state) => { state.loading = true; state.error = null; },
    createSongSuccess: (state, action) => { state.loading = false; state.songs.unshift(action.payload); state.isModalOpen = false; },
    createSongFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    updateSongRequest: (state) => { state.loading = true; state.error = null; },
    updateSongSuccess: (state, action) => {
      state.loading = false;
      const index = state.songs.findIndex(song => song.id === action.payload.id);
      if (index !== -1) state.songs[index] = action.payload;
      state.isModalOpen = false;
      state.editingSong = null;
    },
    updateSongFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    deleteSongRequest: (state) => { state.loading = true; state.error = null; },
    deleteSongSuccess: (state, action) => { state.loading = false; state.songs = state.songs.filter(song => song.id !== action.payload); },
    deleteSongFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    setCurrentPage: (state, action) => { state.pagination.page = action.payload; },
    setPageLimit: (state, action) => { state.pagination.limit = action.payload; state.pagination.page = 1; },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; state.pagination.page = 1; },
    openModal: (state) => { state.isModalOpen = true; state.editingSong = null; },
    closeModal: (state) => { state.isModalOpen = false; state.editingSong = null; state.error = null; },
    setEditingSong: (state, action) => { state.editingSong = action.payload; state.isModalOpen = true; },
    clearError: (state) => { state.error = null; },
  },
});

export const {
  fetchSongsRequest, fetchSongsSuccess, fetchSongsFailure,
  createSongRequest, createSongSuccess, createSongFailure,
  updateSongRequest, updateSongSuccess, updateSongFailure,
  deleteSongRequest, deleteSongSuccess, deleteSongFailure,
  setCurrentPage, setPageLimit, setSearchQuery,
  openModal, closeModal, setEditingSong, clearError,
} = songsSlice.actions;

export default songsSlice.reducer;

export const selectSongs = (state) => state.songs.songs;
export const selectPagination = (state) => state.songs.pagination;
export const selectSearchQuery = (state) => state.songs.searchQuery;
export const selectLoading = (state) => state.songs.loading;
export const selectError = (state) => state.songs.error;
export const selectIsModalOpen = (state) => state.songs.isModalOpen;
export const selectEditingSong = (state) => state.songs.editingSong;
