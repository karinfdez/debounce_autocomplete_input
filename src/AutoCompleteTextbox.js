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
        this.searchDebounced = debounce(this.props.debounceTime, 
        this.autocompleteSearch);
    }

    changeQuery = ((e) => {
        this.setState({inputText: e.target.value}, () => {
            this.searchDebounced(this.state.inputText);
        });
    })

    autocompleteSearch = (inputText) => {
        if(inputText.length > 0) {
            //This fetch is mocking a future request with different query based on user input
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
            .then((myJson) => {
                resolve(myJson)
            }).catch((err) => {
                reject(Error(err.message));
            });
        })
    }

    renderFilteredList() {
        const { inputText } = this.state;
        return (
            inputText.length === 0 ? null : (
                <ul className="filtered-list">
                    {this.state.filteredList.length > 0 &&
                    this.state.filteredList.map((countryObj) => 
                        <li key={countryObj.alpha2Code}>{countryObj.name}</li>
                    )}
                </ul>
            )
        )
    }

    render() {
        return (
            <div className='wrapper'>
                <input 
                    placeholder="Enter a country name..." 
                    type='text' value={this.state.inputText} 
                    onChange={this.changeQuery} 
                />
                {this.renderFilteredList()}
            </div>
        )
    }
}

AutoCompleteTextBox.propTypes = {
    url: PropTypes.string.isRequired,
    debounceTime: PropTypes.number.isRequired
}

AutoCompleteTextBox.defaultProps = {
    url: '',
    debounceTime: 500
}



export default AutoCompleteTextBox;