import React from "react";

export class SearchBox extends React.Component {
    setSearchResults = (results) => this.setState({searchResults: results})

    // Set by child class to call when query has changed
    onQueryChange = (query) => {}
    selectedResult = (result) => {}
    getResultValue = (result) => {}

    setShowResults = (b) => this.setState({showResults: b})
    clearQuery = () => this.setState({query: ''})

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            searchResults: [],
            selectedIndex: -1,
            showResults: false
        }

        this.keyHandler = this.keyHandler.bind(this)
    }

    renderResults() {
        if(this.state.showResults) {
            return this.state.searchResults.map((result, index) => {
                return <li
                    onMouseEnter={() => this.setState({selectedIndex: index})}
                    onClick={() => this.selectedResult(this.state.searchResults[this.state.selectedIndex])}
                    className={"list-group-item " + (this.state.selectedIndex === index ? "active" : "")}
                >{this.getResultValue(result)}</li>
            })
        }
        else {
            return <div></div>
        }
    }

    keyHandler(event) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp' || event.code === 'Enter') {
            event.preventDefault()
            if (event.code === 'ArrowDown' && this.state.selectedIndex < this.state.searchResults.length)
                this.setState({selectedIndex: this.state.selectedIndex + 1})

            if (event.code === 'ArrowUp' && this.state.selectedIndex > -1)
                this.setState({selectedIndex: this.state.selectedIndex - 1})

            if (event.code === 'Enter' && this.state.selectedIndex >= 0 && this.state.selectedIndex < this.state.searchResults.length)
                this.selectedResult(this.state.searchResults[this.state.selectedIndex])

        }
    }

    render() {
        return <div ref={this.props.forwardRef}>
            <input
                onChange={(data) => {
                    const query = data.target.value
                    this.onQueryChange(query)
                    // Update query for useEffect to query API again
                    this.setState({query: query})
                }}
                value={this.state.query}
                className="form-control" type="text"
                placeholder="Search debater"
                aria-label="Search debater"
                onKeyDown={this.keyHandler}
            />

            <ul style={{position: 'absolute', zIndex: '9'}} className="list-group">
                {this.renderResults()}
            </ul>
        </div>
    }
}

export default SearchBox