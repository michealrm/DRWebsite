import React, {useEffect, useState} from "react";
import HomePageAPI from "../api/HomePageAPI";
import SearchBox from "./SearchBox";

// Calling component must set props
//  * clearQuery (takes in a function that is set as a callback)
export class SchoolSearch extends SearchBox {
    constructor(props) {
        super(props);

        this.props.onQueryChange(this.onQueryChange)
        this.props.onSelectedResult(this.selectedResult)
        this.props.setShowResults(this.setShowResults)
        this.props.clearQuery(this.clearQuery)

        // Overriding SearchBox's functions
        this.onQueryChange = (query) => {
            HomePageAPI.get('schoolSearch', {params: {query: query}})
                .then(response => {
                    this.setSearchResults(response.data)
                })
        }

        this.getResultValue = (result) => {
            if(result)
                return result['schoolName']
            else
                return null
        }

        this.selectedResult = (result) => {
            this.setState({
                showResults: false,
                query: result.schoolName
            })
        }
    }
}

export default SchoolSearch