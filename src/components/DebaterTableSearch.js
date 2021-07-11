import React, {useEffect, useState} from "react";
import HomePageAPI from "../api/HomePageAPI";

export const DebaterTableSearch = React.forwardRef((props, ref) => {
    const [tableQuery, setTableQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [showResults, setShowResults] = useState(false)

    props.setShowResults(setShowResults)

    // When query changes, set searchResult state by calling API
    useEffect(() => {
        // Separate school from query with comma is matches SCHOOL, [initials]
        let query = tableQuery
        const split = query.split(' ')
        if(split[split.length - 1].length === 2)
            query = query.substring(0, query.length - 3) + ', ' + query.substring(query.length - 2)

        console.log(query)
        HomePageAPI.get('debaterTableSearch',
            {params: {query: query, event: 'LD', season: props.season}})
            .then(response => {
                setSearchResults(response.data)
            })
    }, [tableQuery])

    const renderResults = () => {
        if(showResults) {
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

    const keyHandler = event => {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp' || event.code === 'Enter') {
            event.preventDefault()
            console.log(event.code + selectedIndex)
            if (event.code === 'ArrowDown' && selectedIndex < searchResults.length)
                setSelectedIndex(selectedIndex + 1)

            if (event.code === 'ArrowUp' && selectedIndex > -1)
                setSelectedIndex(selectedIndex - 1)

            if (event.code === 'Enter' && selectedIndex >= 0 && selectedIndex < searchResults.length)
                props.gotoEntryCallback(searchResults[selectedIndex].page, searchResults[selectedIndex].index)

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
            aria-label="Table Search"
            onKeyDown={keyHandler}
        />

        <ul style={{position: 'absolute', zIndex: '9'}} className="list-group">
            {renderResults()}
        </ul>
    </div>
})

export default DebaterTableSearch