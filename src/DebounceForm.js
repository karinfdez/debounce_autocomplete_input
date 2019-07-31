import React, { Component } from 'react';
import { debounce } from "throttle-debounce";

class DebounceReact extends Component {
    constructor() {
        super()
        this.state = { 
            q: "",
        }
        this.searchDebounced = debounce(500, this.autocompleteSearch);
    }

    changeQuery = ((e) => {
        this.setState({q: e.target.value}, () => {
            if(this.state.q) {
                this.searchDebounced(this.state.q);
            }
        });
    })

    autocompleteSearch = (q) => {
        this.fetchNames(q).then(namesList => {
            console.log(namesList);
        })
    }

    fetchNames = (q) => {
        return new Promise((resolve, reject) => {
            const Http = new XMLHttpRequest();
            const url='https://gist.githubusercontent.com/keeguon/2310008/raw/bdc2ce1c1e3f28f9cab5b4393c7549f38361be4e/countries.json';
            Http.onreadystatechange = (e) => {
                if (Http.readyState === 4 && Http.status === 200) {
                    resolve( Http.responseText);
                 }
            }
            Http.open("GET", url);
            Http.send();
        })
    }

    render() {
        return (
            <div>
                <p>{this.state.q}</p>
                <input placeholder="Please type something..." type='text' value={this.state.q} onChange={this.changeQuery} />
            </div>
        )
    }
}

export default DebounceReact;