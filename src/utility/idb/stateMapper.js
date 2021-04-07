import { localForageService } from '@/utility/idb/localForageService';
import localforageGetItems from 'localforage-getitems';

export const setPersistedState = (state, mutation) => {
  const persistedPayload = mapToPersistedPayload(mutation.payload);

  const promises = [];
  return new Promise((resolve, reject) => {
    promises.push(localForageService.setItem(persistedPayload.id, persistedPayload));

    Promise.all(promises)
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      reject(error);
    })
  });
};

export const getPersistedState = (fetchKey) => {
  if(fetchKey) {
    return localForageService.getItem(fetchKey);
  } else {
    // get everything!!
    return localForageService.getItems().then(resultObj => {
      return Promise.resolve(Object.values(resultObj));
    });
  }
  // u decide how to fetch from cache
}

export const deletePersistedState = (state, payload) => {
  console.log('delete', state, payload)
  return localForageService.removeItem(payload);
  // u decide how to delete cache
}

export const mapToPersistedPayload = (payload) => {
  // whatever your business logic is.
  return JSON.parse(JSON.stringify(payload));
};