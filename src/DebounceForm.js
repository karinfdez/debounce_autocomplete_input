import React, { Component } from 'react';
  
class DebounceReact extends Component {
    constructor() {
        super()
        this.state = { q: "" }
    }

    changeQuery = ((e) => {
        this.setState({searchDebounce: e.target.value}, () => {
            this.autocompleteSearch();
        });
    })

    render() {
        return (
            <div>
                <p>{this.state.searchDebounce}</p>
                <input type='search' onChange={this.changeQuery} />
            </div>
        )
    }
}

export default DebounceReact;