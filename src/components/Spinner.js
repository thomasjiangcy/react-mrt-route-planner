import React, { Component } from 'react';

export default class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.loading) {
            return (
                <span>
                    <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                    <span className="sr-only">Loading...</span>
                </span>
            );
        } else {
            return null;
        }
    }
}
