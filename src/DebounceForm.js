import React, { Component } from 'react';
import { debounce } from "throttle-debounce";

class DebounceReact extends Component {
    constructor() {
        super()
        this.state = { 
            q: "",
            countries: []
        }
        this.searchDebounced = debounce(500, this.autocompleteSearch);
    }

    changeQuery = ((e) => {
        this.setState({q: e.target.value}, () => {
            this.state.q.length > 0 && 
            this.searchDebounced(this.state.q);
        });
    })

    autocompleteSearch = (q) => {
        this.fetchNames(q).then(countriesList => {
            console.log('list countries', countriesList);
        })
    }

    fetchNames = (q) => {
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
                <ul>
                    {this.state.countries.map((countryObj) => <li>{countryObj}</li>)}
                </ul>
            )
        )
    }

    render() {
        return (
            <div>
                <input placeholder="Enter a country name..." type='text' value={this.state.q} onChange={this.changeQuery} />
                {this.renderList()}
            </div>
        )
    }
}

export default DebounceReact;