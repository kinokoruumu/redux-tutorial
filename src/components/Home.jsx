import React from 'react'

export default class Hpme extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>{this.props.count}</h1>
                <button onClick={() => this.props.increment()}>increment</button>
                <button onClick={() => this.props.decrement()}>decrement</button>
            </div>
        )
    }
}