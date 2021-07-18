import React, {useEffect, useState} from "react";
import HomePageAPI from "../api/HomePageAPI";

export const DebaterTableSearch = React.forwardRef((props, ref) => {
    const [tableQuery, setTableQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [showResults, setShowResults] = useState(false)

    props.setShowResults(setShowResults)
    props.clearTableQuery(() => {setTableQuery('')})

    console.log(props.schoolID)

    // When query changes, set searchResult state by calling API
    useEffect(() => {
        let params = {
            params: {
                query: tableQuery,
                event: 'LD'
            }
        }

        if(props.season !== 'ALL')
            params.params.season = props.season
        if(props.schoolID !== -1)
            params.params.school = props.schoolID

        HomePageAPI.get('debaterTableSearch', params)
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
            value={tableQuery}
            className="form-control" type="text"
            placeholder="Search debater"
            aria-label="Search debater"
            onKeyDown={keyHandler}
        />

        <ul style={{position: 'absolute', zIndex: '9'}} className="list-group">
            {renderResults()}
        </ul>
    </div>
})

export default DebaterTableSearch