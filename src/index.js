import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // import the App.js component
import './styles.css';  // import the styles.css file

// create a root DOM element where the React app will be rendered
const root = ReactDOM.createRoot(document.getElementById('root'));

// render the React application inside the 'root' element
root.render(
  <React.StrictMode>   {/* wrap the app in StrictMode for highlighting potential problems in the app during development*/}
    <App />  {/* render the App component inside StrictMode */}
  </React.StrictMode>
);