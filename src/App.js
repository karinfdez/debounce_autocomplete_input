import React from 'react';
import './App.css';
import AutoCompleteTextBox from './AutoCompleteTextBox';

function App() {
  return ( 
    <AutoCompleteTextBox 
      url="https://restcountries.eu/rest/v2/all"
      debounceTime={250}
      numberTypeChars={3}
    />
  );
}

export default App;
