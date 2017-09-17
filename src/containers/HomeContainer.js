import { connect } from 'react-redux'
import Home from "../components/Home.jsx"
import {increment, decrement} from '../actions/actionCreators/counter'

const mapStateToProps = state => {
    return {
        count: state.counter.count
    }
}

const mapDispatchToProps = dispatch => {
    return {
        increment: () => {
            dispatch(increment())
        },
        decrement: () => {
            dispatch(decrement())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)