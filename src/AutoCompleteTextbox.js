import React, { Component } from 'react';
import { debounce } from "throttle-debounce";
import PropTypes from 'prop-types';

class AutoCompleteTextBox extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            inputText: "",
            countries: [],
            filteredList: []
        }
        this.searchDebounced = debounce(this.props.debounceTime, this.autocompleteSearch);
    }

    changeQuery = ((e) => {
        this.state.filteredList.length > 0 && 
        this.setState({filteredList: []});
        this.setState({inputText: e.target.value}, () => {
            if(this.state.inputText.length >= this.props.numberTypeChars) {
                this.searchDebounced(this.state.inputText);
            }
        });
    })

    autocompleteSearch = (inputText) => {
        if(inputText.length >= this.props.numberTypeChars) {
            //This fetch is mocking a future request with different 
            //query everytime there is a change when user types
            this.fetchNames()
            .then(countriesList => {
                let filteredList = [];
                this.setState({countries: countriesList}, 
                    () => {
                    const regex = new RegExp(`^${inputText}`,'i');
                    filteredList = this.state.countries.filter(countryObj => {
                        return countryObj.name.match(regex);
                    })
                })
                this.setState({filteredList});
            }, error => {
                console.error(error);
            })
        }
    }

    fetchNames = () => {
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
        this.setState(() => ({
            inputText: value,
            filteredList: []
        }))              
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
                                onClick={() => this.selectSuggestion(countryObj.name)}
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
            <div className='wrapper'>
                <input 
                    placeholder="Enter a country name..." 
                    value={this.state.inputText} 
                    type='text' 
                    onChange={this.changeQuery} 
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