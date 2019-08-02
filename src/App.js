import React from 'react';
import './App.css';
import AutoCompleteTextbox from './AutoCompleteTextbox';

function App() {
  return ( 
    <AutoCompleteTextbox 
      url="https://restcountries.eu/rest/v2/all"
      debounceTime={500}
      numberTypeChars={3}
    />
  );
}

export default App;
