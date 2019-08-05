import React from 'react';
import './App.css';
import AutoCompleteTextBox from './AutoCompleteTextBox';

function App() {
  return ( 
    <div className="App-component">
      <AutoCompleteTextBox 
        url="https://restcountries.eu/rest/v2/all"
        debounceTime={250}
        numberTypeChars={2}
        amountToHideList={1}
        placeholderMessage={'Enter a country name...'}
      />
    </div>
  );
}

export default App;
