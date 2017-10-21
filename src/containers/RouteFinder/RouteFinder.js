import React, { Component } from 'react';
import findRoutes from '../../routing/findRoutes';
import SearchBar from '../SearchBar/SearchBar';
import RouteList from '../RouteList/RouteList';
import './RouteFinder.css';

export default class RouteFinder extends Component {

    constructor(props) {
        super(props);
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleListChange = this.handleListChange.bind(this);

        this.state = {
            originLatLng: {lat: null, lng: null},
            destinationLatLng: {lat: null, lng: null},
            routesList: null,
            loading: false
        };
    }

    /*
     * Handles change in Origin input field
    */
    handleOriginChange() {
        setTimeout(() => {
            const input = document.getElementById('origin');
            const options = { componentRestrictions: { country: 'sg' } };
            const originSearch = new window.google.maps.places.Autocomplete(input, options);
            originSearch.addListener('place_changed', () => {
                const place = originSearch.getPlace();
                const location = place.geometry.location.toJSON();
                this.setState({originLatLng: location});
            });
        }, 100);
    }

    /*
     * Handles change in Destination input field
    */
    handleDestinationChange() {
        setTimeout(() => {
            const input = document.getElementById('destination');
            const options = { componentRestrictions: { country: 'sg' } };
            const destinationSearch = new window.google.maps.places.Autocomplete(input, options);
            destinationSearch.addListener('place_changed', () => {
                const place = destinationSearch.getPlace();
                const location = place.geometry.location.toJSON();
                this.setState({destinationLatLng: location});
            });
        }, 100);
    }

    /*
     * Handles the change in list of steps after search is submitted
    */
    handleListChange() {

        if (this.state.originLatLng.lat &&
            this.state.originLatLng.lng &&
            this.state.destinationLatLng.lat &&
            this.state.destinationLatLng.lng) {
            const routesList = findRoutes(this.state.originLatLng, this.state.destinationLatLng);
            this.setState({routesList: routesList});
        } else {
            alert("Please enter an origin and destination!");
        }
    }



    render() {

        return (
            <div className='RouterFinder'>
                <div className='main'>
                    <div className='header'>
                        <h3>
                            <i style={{marginRight: 15}} className="fa fa-train" aria-hidden="true" />MRT Routes Finder
                        </h3>
                    </div>
                    <SearchBar
                        buttonValue={this.state.loading ? "Finding Routes..." : "Find Routes"}
                        loading={this.state.loading}
                        onListChange={this.handleListChange}
                        onOriginChange={this.handleOriginChange}
                        onDestinationChange={this.handleDestinationChange} />
                    <RouteList routesList={this.state.routesList} />
                </div>
            </div>
        );
    }
}
