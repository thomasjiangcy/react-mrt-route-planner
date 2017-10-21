import React, { Component } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './SearchBar.css';

export default class SearchBar extends Component {

    constructor(props) {
        super(props);
        // binds
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
     * Handles change in Origin input field
    */
    handleOriginChange() {
        this.props.onOriginChange();  
    }

    /*
     * Handles change in Destination input field
    */
    handleDestinationChange() {
        this.props.onDestinationChange();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onListChange();
    }

    render() {

        return (
            <div className='SearchBar'>
                <form onSubmit={this.handleSubmit}>
                    <Input
                        id='origin'
                        onInputChange={this.handleOriginChange}
                        placeholder='From' />

                    <Input
                        id='destination'
                        onInputChange={this.handleDestinationChange}
                        placeholder='To' />
                    <Button
                        value={this.props.buttonValue}
                        disabled={this.props.loading} />
                </form>
            </div>
        );
    }
}
