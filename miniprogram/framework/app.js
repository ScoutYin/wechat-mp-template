import { queryParser } from './plugins/index'

const createApp = App

export default options => {
	const { onLaunch, onShow } = options;
	Object.assign(options, {
		onLaunch(opts) {
			// 注册插件
			// 实际业务中根据实际情况决定使用哪些插件
			this.usePlugin(queryParser, {
				sceneKey: 'scene',
				scene2Query: async () => {
					return new Promise(resolve => {
						// 模拟接口返回解析结果，具体业务开发时需要替换
						setTimeout(() => {
							resolve({ a: 1, b: 2 })
						}, 1000)
					})
				}
			})
			onLaunch && onLaunch.call(this, opts)
		},

		async onShow(opts) {
			this.$enterOptions = opts
			this.$enterOptions.query = await this.queryParser(opts.query)
			onShow && onShow.call(this, opts)
		},
		/**
		 * 注册插件（如单独抽离的某些辅助逻辑、工具）
		 * @param {*} plugin 插件对象，需提供 install 方法
		 */
		usePlugin(plugin, opts) {
			const install = plugin.install
			if (typeof install === 'function') {
				install(this, opts)
			} else {
				throw new Error("plugin's install method is requird.")
			}
		}
	})

	createApp(options)
}
