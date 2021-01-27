import './a.less'

import React from 'react'

interface IProps {
	name: string
	age: number
}

function App(props: IProps) {
	const { name, age } = props
	return (
		<div className="app">
			<span>{`测试2=>我是${name}: ${age}岁`}</span>
		</div>
	)
}

export default App
