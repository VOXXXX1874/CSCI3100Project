import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {PageProvider} from './components/appPage/pageContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
// Please refer to ./components/appPage/pageContext.js for detail of <PageProvider>. It provides the page context and functions for changing context.
// Basically, page context is used to tell the React which page it should render now.
// <App/> contains everything of our application
root.render(
    <React.StrictMode>
      <PageProvider>
        <App/>
      </PageProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
