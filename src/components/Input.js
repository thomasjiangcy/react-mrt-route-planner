import React, { Component } from 'react';
import './Input.css';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onInputChange(event.target.value);
    }

    render() {
        return (
            <div className='Input-form-group'>
                <label>{this.props.placeholder}</label>
                <input
                    id={this.props.id}
                    onChange={this.handleChange}
                    className='Input-form-control'
                    placeholder='' />
            </div>
        );
    }
}
