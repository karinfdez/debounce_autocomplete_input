import React, { Component } from 'react';
import { debounce } from "throttle-debounce";

class DebounceReact extends Component {
    constructor() {
        super()
        this.state = { 
            q: "",
            countries: [],
            filteredList: []
        }
        this.searchDebounced = debounce(600, this.autocompleteSearch);
    }

    changeQuery = ((e) => {
        this.setState({q: e.target.value}, () => {
            this.searchDebounced(this.state.q);
        });
    })

    autocompleteSearch = (q) => {
        if(q.length > 0) {
            //This fetch is mocking a future request with different query based on user input
            this.fetchNames()
            .then(countriesList => {
                let filteredList = [];
                this.setState({countries: countriesList}, () => {
                    const regex = new RegExp(`^${q}`,'i');
                    filteredList = this.state.countries.filter(v => {
                        return v.name.match(regex);
                    })
                })
                this.setState({filteredList});
            })
        }
    }

    fetchNames = () => {
        return new Promise((resolve, reject) => {
            const url = "https://restcountries.eu/rest/v2/all";
            fetch(url, {method: 'get'})
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                resolve(myJson)
            }).catch((err) => {
                throw new Error(err.message);
            });
        })
    }

    renderList() {
        const { q } = this.state;
        return (
            q.length === 0 ? null : (
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
                    type='text' value={this.state.q} 
                    onChange={this.changeQuery} 
                />
                {this.renderList()}
            </div>
        )
    }
}

export default DebounceReact;