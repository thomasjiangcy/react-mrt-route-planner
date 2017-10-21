import React, { Component } from 'react';
import './Button.css';

export default class Button extends Component {

    render() {
        return (
            <button type="submit" disabled={this.props.disabled}>{this.props.value}</button>
        );
    }
}
