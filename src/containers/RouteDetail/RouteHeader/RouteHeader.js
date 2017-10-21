import React, { Component } from 'react';
import { lines } from '../../../routing/mrt.json';
import RouteBody from '../RouteBody/RouteBody';
import './RouteHeader.css';

export default class RouteHeader extends Component {
    constructor(props) {
        super(props);
        this.constructHeaderMsg = this.constructHeaderMsg.bind(this);
        this.getActionTarget = this.getActionTarget.bind(this);
        this.returnMsg = this.returnMsg.bind(this);
        this.parseStepMRT = this.parseStepMRT.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    constructHeaderMsg(route) {
        const startMsg = `Start by ${this.getAction(route)} ${this.getActionTarget(route.steps[0])}`;
        

        if (startMsg) return startMsg;

        return null;
    }

    constructHeaderMRTLines(route) {
        let mrtLines = [];

        for (let step of route.steps) {
            if ("line" in step) mrtLines.push(step.line);
        }

        return mrtLines;
    }

    getAction(route) {
        switch (route.steps[0].type) {
            case "walk": return `walking ${Number(route.steps[0].distance).toFixed(0)}m towards`;
            case "ride": return "taking the MRT from";
            case "change": return "changing from";
            default:
                return '';
        }
    }

    getActionTarget(routeStep) {
        switch (routeStep.type) {
            case "walk": {
                const towards = this.parseStepMRT(routeStep, true);
                return towards + " MRT";
            }
            case "ride": return this.returnMsg(routeStep);
            case "change": return this.returnMsg(routeStep);
            default:
                return '';
        }
    }

    returnMsg(routeStep) {
        const from = this.parseStepMRT(routeStep);
        const fromMsg = from + " Line";
        const to = this.parseStepMRT(routeStep, true);
        const toMsg = to + " Line";
        return fromMsg + " to " + toMsg;
    }

    parseStepMRT(routeStep, isTo=false) {
        let target;
        if (isTo) {
            target = routeStep.to.split("_");
        } else {
            target = routeStep.from.split("_");
        }

        for (let i = 0; i < target.length; i ++) {
                target[i] = target[i].charAt(0).toUpperCase() + target[i].substr(1).toLowerCase();
            }

        return target.join(" ");
    }

    getBackgroundColor(line) {
        if (lines[line] !== undefined) return lines[line].color;
    }

    clickHandler(event) {
        this.props.onSelect();
    }

    render() {
        const routeHeaderMRTLines = this.constructHeaderMRTLines(this.props.route);
        const MRTLines = routeHeaderMRTLines.map((line, index) => {
                const style = {
                    backgroundColor: this.getBackgroundColor(line)
                }

                return (<li className='mrtLine' key={index} style={style}>{line}</li>);
            });
        const routeHeaderMsg = this.constructHeaderMsg(this.props.route);

        if (this.props.selected) {
            return (
                <div className="RouteHeader-wrapper" onClick={this.clickHandler}>
                    <RouteBody
                            route={this.props.route} 
                            selected={this.props.selected}
                            />
                </div>
            );
        } else {
            return (
                <div className="RouteHeader-wrapper" onClick={this.clickHandler}>
                    <ul className="RouteHeader-lines">{MRTLines}</ul>
                    <p>{routeHeaderMsg}</p>
                    <p className="showInfo">Click to Show More Information</p>
                </div>
        )   ;
        }
    }
}
