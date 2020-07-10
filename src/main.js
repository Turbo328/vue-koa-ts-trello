import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Message from '@/components/TMessage/TMessage.js';
import utils from '@/utils';

import '@/assets/css/css.css'

Vue.config.productionTip = false

Vue.prototype.$message = Message;
Vue.prototype.$utils = utils;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
