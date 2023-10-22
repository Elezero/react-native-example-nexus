import React from 'react'
import MultipleItemsOffile from './src/multipleItemsOffline'
import SingleItemOffline from './src/singleItemOflline'
import {Provider} from 'react-redux'
import {store} from './src/redux/store'

const App = () => {
	return (
		<>
			<Provider store={store}>
				<MultipleItemsOffile />
			</Provider>
			{/* <SingleItemOffline id={'100'} /> */}
		</>
	)
}

export default App
