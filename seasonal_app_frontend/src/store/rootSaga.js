/**
 * Root saga - combines all sagas
 */
import { all } from 'redux-saga/effects';
import { watchAuthSagas, watchProfileSagas } from './sagas';

export default function* rootSaga() {
  yield all([
    watchAuthSagas(),
    watchProfileSagas(),
  ]);
}

