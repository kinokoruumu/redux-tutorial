import React from "react"
import { Provider } from 'react-redux'
import { store } from '../store/configureStore'
import HomeContainer from '../containers/HomeContainer'

const App = () => (
    <Provider store={store}>
        <HomeContainer/>
    </Provider>
)

export default App