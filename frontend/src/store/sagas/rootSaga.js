import { songsSaga } from './songsSaga';

export function* rootSaga() {
  yield* songsSaga();
}
