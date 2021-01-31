const Test = () => import(/* webpackChunkName: "test" */ '../views/test/test')

const routerConfig = {
	router: [
		{
			path: '/',
			exact: true,
			component: Test,
		},
	],
}

export default routerConfig
