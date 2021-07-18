import React from 'react';
import HomePageAPI from '../api/HomePageAPI';
import {DebaterTableSearch} from "./DebaterTableSearch";
import {SchoolSearch} from "./SchoolSearch";

class App extends React.Component {

    state = {
        page: 0,
        pages: 0,
        event: '',
        season: 0,
        rankings: [],
        seasons: [],
        selectedPage: -1,
        selectedIndex: -1,
        selectedSchoolID: -1
    };

    // Set by DebateTableSearch or TeamTableSearch component
    showTableSearchResults = (b) => {}
    setSchoolShowResults = (b) => {}
    clearTableQuery = () => {}
    clearSchoolTableQuery = () => {}

    constructor(props) {
        super(props);

        this.refSchoolTableSearch = React.createRef()
        this.refDebaterTableSearch = React.createRef()

        this.clickHandler = this.clickHandler.bind(this)
        this.gotoTableEntry = this.gotoTableEntry.bind(this)
    }

    ///////////////
    // Lifecycle //
    ///////////////

    componentDidMount() {
        document.addEventListener('mousedown', this.clickHandler)

        this.updatePageLength('CX', 2020)
        this.updateRankings(0, 'CX', 2020)
        this.getSeasons()
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.clickHandler)
    }

    ///////////
    // Hooks //
    ///////////

    clickHandler(event) {
        // Click on school search
        if(this.refSchoolTableSearch && this.refSchoolTableSearch.current.contains(event.target)) {
            this.setSchoolShowResults(true)
            this.showTableSearchResults(false)
        // Click on debater search
        } else if (this.refDebaterTableSearch && this.refDebaterTableSearch.current.contains(event.target)) {
            this.showTableSearchResults(true)
            this.setSchoolShowResults(false)
        // Click on search
        } else {
            this.setSchoolShowResults(false)
            this.showTableSearchResults(false)
        }
    }

    ///////////////
    // Callbacks //
    ///////////////

    callbackSetSchoolID(result) {
        this.setState({selectedSchoolID: result.id})
    }

    callbackOnSchoolQueryChange() {
        this.setState({selectedSchoolID: -1})
    }

    clearQueries() {
        this.clearSchoolTableQuery()
        this.clearTableQuery()
    }

    gotoTableEntry(page, index) {
        this.setState({
            selectedPage: page,
            selectedIndex: index,
        })

        if(page !== -1)
            this.updatePage(page)
    }

    ////////////////////
    // Page Functions //
    ////////////////////

    updatePageLength(event, season) {
        this.setState({pages: 0})

        let pageLenParams = {
            params: {
                event: event,
            }
        }
        if(season !== 'ALL')
            pageLenParams.params.season = season

        HomePageAPI.get('/pageLength', pageLenParams).then(pageLengthResponse => {
            this.setState({
                pages: pageLengthResponse.data
            })
        })
    }

    updateRankings = async (page, event, season) => {
        this.setState({
            page: page,
            event: event,
            season: season,
        })

        let rankingsParams = {
            params: {
                page: page,
                event: event,
            }
        }
        if(season !== 'ALL')
            rankingsParams.params.season = season

        HomePageAPI.get('/rankingPage', rankingsParams).then(rankingsResponse => {
            this.setState({
                rankings: rankingsResponse.data,
            });
        })


    }

    async getSeasons() {
        const response = await HomePageAPI.get('getSeasons', {params: {}})

        this.setState({
            seasons: response.data
        });
    }

    updateSeason(season) {
        this.clearQueries()
        this.updatePageLength(this.state.event, season)
        this.updateRankings(0, this.state.event, season)
    }

    updateEvent(event) {
        this.clearQueries()
        this.updatePageLength(event, this.state.season)
        this.updateRankings(0, event, this.state.season)
    }

    updatePage(page) {
        this.updateRankings(page, this.state.event, this.state.season)
    }

    setShowSearchResults(set) {
        this.setState({showTableSearchResults: set})
    }

    ////////////
    // Render //
    ////////////

    render() {
        return (
            <div className="container">
                <div className="col-mid-2"></div>
                <div className="col-mid-8">

                    <div id="top-bar" style={{display: "flex"}}>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.event}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" onClick={() => this.updateEvent('CX')}>CX</a>
                                <a className="dropdown-item" onClick={() => this.updateEvent('PF')}>PF</a>
                                <a className="dropdown-item" onClick={() => this.updateEvent('LD')}>LD</a>
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.season}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" onClick={e => {
                                    this.updateSeason(e.target.innerHTML)
                                }
                                }>ALL</a>
                                {
                                    this.state.seasons.map(season => {
                                        return <a
                                            className="dropdown-item"
                                            onClick={e => {this.updateSeason(e.target.innerHTML)}}
                                        >{season}</a>
                                    })
                                }
                            </div>
                        </div>

                        <nav aria-label="...">
                            <ul className="pagination">
                                <li className={this.state.page === 0 ? "disabled page-item" : "page-item"}>
                                    <a className="page-link" tabIndex="-1" onClick={() => {this.updatePage(this.state.page - 1)}}>Previous</a>
                                </li>
                                <li className={this.state.page >= this.state.pages ? "disabled page-item" : "page-item"}>
                                    <a className="page-link" tabIndex="1" onClick={() => {this.updatePage(this.state.page + 1)}}>Next</a>
                                </li>
                            </ul>
                        </nav>

                        <div>Page {this.state.page + 1} out of {this.state.pages === 0 ? 'loading...' : this.state.pages}</div>


                        <div className="input-group mb-3">
                            <SchoolSearch
                                forwardRef={this.refSchoolTableSearch}
                                clearQuery={f => this.clearSchoolTableQuery = f}
                                setShowResults={f => (this.setSchoolShowResults = f)}
                                onSelectedResult={f => (this.callbackSetSchoolID = f)}
                                onQueryChange={f => (this.callbackOnSchoolQueryChange = f)}
                                />
                            <DebaterTableSearch
                                season={this.state.season}
                                schoolID={this.state.selectedSchoolID}
                                setShowResults={f => (this.showTableSearchResults = f)}
                                clearTableQuery={f => (this.clearTableQuery = f)}
                                ref={this.refDebaterTableSearch}
                                gotoEntryCallback={this.gotoTableEntry}/>
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">School</th>
                            <th scope="col">{this.state.event === 'LD' ? "Debater" : "Team"}</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Num Rounds</th>
                            <th scope="col">Rating Deviation</th>
                            <th scope="col">Season</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.rankings.map((re, index) => { // Ranking Entry
                                if(re !== null) {
                                    return <tr style={
                                        this.state.page === this.state.selectedPage &&
                                        index === this.state.selectedIndex ?
                                            {backgroundColor: '#ffff99'} :
                                            {}
                                    }>
                                        <th scope="row">{re.ranking}</th>
                                        <td>{re.schoolName}</td>
                                        <td>{re.debaterName}</td>
                                        <td>{re.rating}</td>
                                        <td>{re.numRounds}</td>
                                        <td>{re.ratingDeviation}</td>
                                        <td>{re.season}</td>
                                    </tr>
                                } else {
                                    return []
                                }
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div className="col-mid-2"></div>
            </div>
        );
    }
}

export default App;