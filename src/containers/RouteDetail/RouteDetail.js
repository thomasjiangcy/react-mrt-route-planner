import React, { Component } from 'react';

import RouteHeader from './RouteHeader/RouteHeader';
import './RouteDetail.css';

export default class RouteDetail extends Component {
    constructor(props) {
        super(props);
        this.selectHandler = this.selectHandler.bind(this);
        this.state = {selected: false};
    }

    selectHandler() {
        this.setState((prevState, props) => {
            return {
                selected: !prevState.selected
            };
        })
    }

    render() {
        const route = this.props.route;

        if (route) {
            return (
                <div className='RouteDetail'>
                    <RouteHeader
                        route={route}
                        onSelect={this.selectHandler}
                        selected={this.state.selected}
                        />
                </div>
            );
        }
        
        return null;
    }
}
