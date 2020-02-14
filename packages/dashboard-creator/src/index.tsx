import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { createStore } from './create-store';
import { createRootReducer } from './reducer';

import { appStart } from './actions';
import { rootSaga } from './saga';

import App from './app.component';

type Options = {
  container: string;
  projectId: string;
  masterKey: string;
};

export const DashboardCreator = ({
  container,
  projectId,
  masterKey,
}: Options) => {
  const reducer = createRootReducer();
  const sagaMiddleware = createSagaMiddleware({
    context: {
      projectId,
      masterKey,
    },
  });

  const store = createStore(reducer, [sagaMiddleware]);

  sagaMiddleware.run(rootSaga);
  store.dispatch(appStart(projectId, masterKey));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector(container)
  );
};
