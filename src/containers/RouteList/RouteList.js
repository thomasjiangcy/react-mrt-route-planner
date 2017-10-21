import React, { Component } from 'react';

import RouteDetail from '../RouteDetail/RouteDetail';
import './RouteList.css';

export default class RouteList extends Component {

    render() {
        const routes = this.props.routesList;


        let routesList;

        if (routes) {

            if (routes["error"]) {
                return (
                    <div className='RouteList'>
                        <div className='main'>
                            <div className='header'>
                                <h3>Suggested routes</h3>
                            </div>
                            <p>{routes["error"]}</p>
                        </div>
                    </div>
                )
            }

            routesList = routes.map((route, index) => {
            return <RouteDetail key={index} route={route} />
        });
        }


        if (routesList) {
            return (
                <div className='RouteList'>
                    <div className='main'>
                        <div className='header'>
                            <h3>Suggested routes</h3>
                        </div>
                        <ul className="RouteList-routes-list">{routesList}</ul>
                    </div>
                </div>
            );
        }

        return null;
    }
}
