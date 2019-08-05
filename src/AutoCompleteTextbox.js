import React, { Component } from "react";
import { debounce } from "throttle-debounce";
import PropTypes from "prop-types";
import "./AutoCompleteTextBox.css"; //To ensure it loads on the head of the document
import fetchData from "./services/countries-services";

class AutoCompleteTextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      countries: [],
      filteredList: []
    };
    this.searchDebounced = debounce(
      props.debounceTime,
      this.autocompleteSearch
    );
  }

  handleChange = e => {
    const text = e.target.value;
    this.changeQuery(text);
  };

  changeQuery(text) {
    const newState = {
      inputText: text
    };
    //Hides list when removing input and leaving # of elements typed
    text.length === this.props.amountToHideList && (newState.filteredList = []);
    this.setState({ ...newState }, () => {
      if (this.state.inputText.length >= this.props.numberTypeChars) {
        this.searchDebounced(this.state.inputText);
      }
    });
  }

  autocompleteSearch = inputText => {
    //This fetch is mocking a request to an API that varies
    //everytime there is a change when user types
    fetchData(this.props.url, this.props.fetchData)
      .then(list => {
        let filteredList = [];
        const regex = new RegExp(`^${inputText}`, "i");
        filteredList =
          list &&
          list.length > 0 &&
          list.filter(objectElem => {
            return objectElem.name.match(regex);
          });
        this.setState({ countries: list, filteredList });
      })
      .catch(error => {
        console.error(error);
      });
  };

  selectSuggestion(value) {
    this.setState({
      inputText: value,
      filteredList: []
    });
  }

  renderFilteredList() {
    const { inputText, filteredList } = this.state;
    return inputText.length === 0 ? null : (
      <ul className="list-selection">
        {filteredList.length > 0 &&
          filteredList.map(countryObj => (
            <li
              key={countryObj.alpha2Code}
              onClick={() => this.selectSuggestion(countryObj.name)}
            >
              {countryObj.name}
            </li>
          ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="wrapper-container">
        <label htmlFor="search input">
          <input
            placeholder={this.props.placeholderMessage}
            value={this.state.inputText}
            type="text"
            onChange={this.handleChange}
          />
        </label>
        {this.renderFilteredList()}
      </div>
    );
  }
}

AutoCompleteTextBox.propTypes = {
  url: PropTypes.string.isRequired,
  debounceTime: PropTypes.number,
  numberTypeChars: PropTypes.number,
  fetchData: PropTypes.object,
  amountToHideList: PropTypes.number,
  placeholderMessage: PropTypes.string
};

AutoCompleteTextBox.defaultProps = {
  url: "",
  debounceTime: 250,
  numberTypeChars: 1,
  fetchData: {},
  amountToHideList: 1,
  placeholderMessage: ""
};

export default AutoCompleteTextBox;
