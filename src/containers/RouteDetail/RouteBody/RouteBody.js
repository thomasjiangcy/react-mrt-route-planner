import React, { Component } from 'react';
import { lines } from '../../../routing/mrt.json';
import { retrieveStation } from '../../../routing/findRoutes';
import './RouteBody.css';

export default class RouteBody extends Component {

    constructor(props) {
        super(props);
        this.constructBody = this.constructBody.bind(this);
        this.getRowDetails = this.getRowDetails.bind(this);
    }

    constructBody(route) {

        const row = route.steps.map((step, index) => {
            return (
                <span key={index} className='RouteBody-row'>
                    <span className='RouteBody-step-count'>{index + 1}</span>{this.getRowDetails(step)}
                </span>);
        })

        return row;
    }

    getBackgroundColor(line) {
        if (line !== undefined) {
            return lines[line].color;
        } 
    }

    getAction(step) {
        switch (step.type) {
            case "walk": return `Walk ${Number(step.distance).toFixed(0)}m towards`;
            case "ride": return "Take the MRT from";
            case "change": return "Change from";
            default:
                return '';
        }
    }

    getRowDetails(step) {
        if (step.type === "ride") {
            const line = step.line;
            const fromStop = retrieveStation(step.from).name;
            const toStop = retrieveStation(step.to).name;
            const stopCount = step.stops_between;
            const style = { backgroundColor: this.getBackgroundColor(line) }
            const fontColor = { color: this.getBackgroundColor(line) }

            return (
                <div className='RouteBody-step-details'>
                    <span className='mrtLine' style={style}>{line}</span> <span style={fontColor}>{fromStop}</span> {stopCount ? `> After ${stopCount} ${stopCount > 1 ? "Stops" : "Stop"} ` : null} > <span style={fontColor}>{toStop}</span>
                </div>
            );
        } else if (step.type === "walk") {
            const toStop = (step.to === "destination") ? "destination" : retrieveStation(step.to).name + " MRT";

            return (
                <div className='RouteBody-step-details'>
                    {this.getAction(step)} {toStop}
                </div>
            );
        } else {
            return (
                <div className='RouteBody-step-details'>
                    {this.getAction(step)} <span className='mrtLine' style={{backgroundColor: this.getBackgroundColor(step.from)}}>{step.from}</span> to <span className='mrtLine' style={{backgroundColor: this.getBackgroundColor(step.to)}}>{step.to}</span>
                </div>
            );
        }
    }

    render() {
        const routeBody = this.constructBody(this.props.route);
        const selected = this.props.selected;

        if (selected) {
            return (
                <div className='RouteBody'>
                    <div className='RouteBody-content'>
                        {routeBody}
                    </div>
                    <p className='showInfo' style={{marginTop: 15}}>Click to Show Less</p>
                </div>
            );
        }

        return null;
    }
}
