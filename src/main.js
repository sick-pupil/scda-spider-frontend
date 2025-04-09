import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import * as echarts from 'echarts';


import '@/style/element-variables.scss'
import '@/style/element-styles.scss'

Vue.config.devtools = true;

Vue.use(ElementUI)
Vue.prototype.$echarts = echarts

new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')
