import { call, put, takeEvery, select } from 'redux-saga/effects';
import { songsApi } from '@services/api';
import { fetchSongsRequest, fetchSongsSuccess, fetchSongsFailure, createSongRequest, createSongSuccess, createSongFailure, updateSongRequest, updateSongSuccess, updateSongFailure, deleteSongRequest, deleteSongSuccess, deleteSongFailure, selectPagination, selectSearchQuery } from '../songsSlice';

function* fetchSongsSaga() {
  try {
    const pagination = yield select(selectPagination);
    const searchQuery = yield select(selectSearchQuery);
    const params = { page: pagination.page, limit: pagination.limit, search: searchQuery };
    const response = yield call(songsApi.fetchSongs, params);
    
    // Map the response to match expected structure
    const mappedResponse = {
      data: response.data.data || response.data,
      page: response.data.currentPage || response.data.page || 1,
      limit: pagination.limit,
      total: response.data.totalItems || response.data.total || 0,
      totalPages: response.data.totalPages || 1
    };
    
    yield put(fetchSongsSuccess(mappedResponse));
  } catch (error) {
    yield put(fetchSongsFailure(error.response?.data?.error || error.message || 'Failed to fetch songs'));
  }
}

function* createSongSaga(action) {
  try {
    const response = yield call(songsApi.createSong, action.payload);
    yield put(createSongSuccess(response.data));
    yield put(fetchSongsRequest());
  } catch (error) {
    yield put(createSongFailure(error.response?.data?.error || error.message || 'Failed to create song'));
  }
}

function* updateSongSaga(action) {
  try {
    const { id, ...songData } = action.payload;
    const response = yield call(songsApi.updateSong, id, songData);
    yield put(updateSongSuccess(response.data));
    yield put(fetchSongsRequest());
  } catch (error) {
    yield put(updateSongFailure(error.response?.data?.error || error.message || 'Failed to update song'));
  }
}

function* deleteSongSaga(action) {
  try {
    yield call(songsApi.deleteSong, action.payload);
    yield put(deleteSongSuccess(action.payload));
    yield put(fetchSongsRequest());
  } catch (error) {
    yield put(deleteSongFailure(error.response?.data?.error || error.message || 'Failed to delete song'));
  }
}

export function* songsSaga() {
  yield takeEvery(fetchSongsRequest.type, fetchSongsSaga);
  yield takeEvery(createSongRequest.type, createSongSaga);
  yield takeEvery(updateSongRequest.type, updateSongSaga);
  yield takeEvery(deleteSongRequest.type, deleteSongSaga);
}
