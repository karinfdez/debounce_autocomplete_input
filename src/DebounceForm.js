import React, { Component } from 'react';
  
class DebounceReact extends Component {
    constructor() {
        super()
        this.state = { 
            q: ""
        }
    }

    changeQuery = ((e) => {
        this.setState({searchDebounce: e.target.value}, () => {
            this.autocompleteSearch(this.state.q);
        });
    })

    autocompleteSearch = (q) => {
    }

    render() {
        return (
            <div>
                <p>{this.state.searchDebounce}</p>
                <input placeholder="Please type something..." type='text' value={this.state.q} onChange={this.changeQuery} />
            </div>
        )
    }
}

export default DebounceReact;