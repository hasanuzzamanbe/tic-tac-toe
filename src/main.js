import Vue from 'vue'
import App from './App.vue'


import {
  Button,
  ButtonGroup,
  Container,
  Header,
  Main,
  Aside,
  Dialog
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Aside);
Vue.use(Dialog);
new Vue({
  render: h => h(App),
}).$mount('#app')








