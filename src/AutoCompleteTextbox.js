import React, { Component } from 'react';
import { debounce } from "throttle-debounce";
import PropTypes from 'prop-types';
import './AutoCompleteTextBox.css' //To ensure it loads on the head of the document

class AutoCompleteTextBox extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            inputText: "",
            countries: [],
            filteredList: []
        }
        this.searchDebounced = debounce(props.debounceTime, this.autocompleteSearch);
    }

    handleChange =(e) => {
        const text =  e.target.value;
        this.changeQuery(text);
    };
    
    changeQuery(text) {
        const newState = {
            inputText: text
        };
        (this.state.filteredList.length > 0) && 
        (newState.filteredList = []);
        this.setState({ ...newState }, () => {
            if(this.state.inputText.length >= this.props.numberTypeChars) {
                this.searchDebounced(this.state.inputText);
            }
        });
    }

    autocompleteSearch = (inputText) => {
        //This fetch is mocking a request to an API that varies 
        //everytime there is a change when user types
        this.fetchApi()
        .then(list => {
            let filteredList = [];
            const regex = new RegExp(`^${inputText}`,'i');
            filteredList = list.filter(objectElem => {
                return objectElem.name.match(regex);
            })
            this.setState({countries: list, filteredList});
        }, error => {
            console.error(error);
        })
    }

    fetchApi = () => {
        return new Promise((resolve, reject) => {
            fetch(this.props.url, {method: 'get'})
            .then((response) => {
                return response.json();
            })
            .then((jsonResult) => {
                resolve(jsonResult)
            }).catch((err) => {
                reject(Error(err.message));
            });
        })
    }

    selectSuggestion(value) {
        this.setState({inputText: value, 
            filteredList: []
        })  
    }

    renderFilteredList() {
        const { inputText, filteredList } = this.state;
        return (
            inputText.length === 0  ? null : (
                <ul className="filtered-list">
                    {filteredList.length > 0 && (
                        filteredList.map((countryObj) => 
                            <li 
                                key={countryObj.alpha2Code} 
                                onClick={() => 
                                this.selectSuggestion(countryObj.name)}
                            >
                                {countryObj.name}
                            </li>
                        ))
                    }
                </ul>
            )
        )
    }

    render() {
        return (
            <div className='autocompleteTextBox'>
                <input 
                    placeholder="Enter a country name..." 
                    value={this.state.inputText} 
                    type='text' 
                    onChange={this.handleChange} 
                />
                {this.renderFilteredList()}
            </div>
        )
    }
}

AutoCompleteTextBox.propTypes = {
    url: PropTypes.string.isRequired,
    debounceTime: PropTypes.number,
    numberTypeChars: PropTypes.number
}

AutoCompleteTextBox.defaultProps = {
    url: '',
    debounceTime: 500,
    numberTypeChars: 1
}



export default AutoCompleteTextBox;