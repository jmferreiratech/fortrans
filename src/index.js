import React from 'react';
import ReactDOM from 'react-dom';
import theme from './resources/toolbox/theme';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import "material-design-icons/iconfont/material-icons.css";
import './resources/toolbox/theme.css';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById('root'));
registerServiceWorker();
