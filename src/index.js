import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import rootReducer from './store/reducers/rootReducer.js';

//Use Local Storage Persistance
const saveToLocalStorage = state => {
  try {
    let stringState = JSON.stringify(state);
    localStorage.setItem('@state-police', stringState);
  } catch (err) {
    console.log(err);
  }
};

const loadFromLocalStorage = () => {
  try {
    let stringState = localStorage.getItem('@state-police');
    if (stringState === null) return undefined;
    return JSON.parse(stringState);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const persistedStorage = loadFromLocalStorage();

const store = createStore(
  rootReducer,
  persistedStorage,
  applyMiddleware(thunk)
);

store.subscribe(() => saveToLocalStorage(store.getState()));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: registration => {
    alert('New version of Crime Response available!  Ready to  auto update?');
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
