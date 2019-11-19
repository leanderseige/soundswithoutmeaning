import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/app.js';
import store from './store';

render(
    <Provider store={store}>
        <App layers={5} />
    </Provider>,
    document.getElementById('root')
);
