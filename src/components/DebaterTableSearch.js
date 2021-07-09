import React, {useEffect, useState} from "react";
import HomePageAPI from "../api/HomePageAPI";

export const DebaterTableSearch = React.forwardRef((props, ref) => {
    const [tableQuery, setTableQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)

    // When query changes, set searchResult state by calling API
    useEffect(() => {
        HomePageAPI.get('debaterTableSearch',
            {params: {query: tableQuery}})
            .then(response => {
                setSearchResults(response.data)
            })
    }, [tableQuery])

    const renderResults = () => {
        if(props.showResults) {
            return searchResults.map((result, index) => {
                return <li
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => props.gotoEntryCallback(searchResults[index].page, searchResults[index].index)}
                    className={"list-group-item " + (selectedIndex === index ? "active" : "")}
                >{result.name}</li>
            })
        }
        else {
            return <div></div>
        }
    }

    return <div ref={ref}>
        <input
            onChange={(data) => {
                // Unhighlight current selected row
                props.gotoEntryCallback(-1, -1)
                // Update query for useEffect to query API again
                setTableQuery(data.target.value)
            }}
            className="form-control" type="text"
            placeholder="Search debaters"
            aria-label="Table Search" />

        <ul style={{position: 'absolute', zIndex: '9'}} className="list-group">
            {renderResults()}
        </ul>
    </div>
})

export default DebaterTableSearch