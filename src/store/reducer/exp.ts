import defaultState from '../state/exp'

const exp = (state = defaultState, action: { type: string; data: number }) => {
	switch (action.type) {
		case 'INCREASE':
			return state + action.data
		default:
			return state
	}
}

export default exp
