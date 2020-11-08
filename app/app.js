import Vue from "nativescript-vue";
import Vuex from 'vuex'

import Home from "./components/Home";


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {

  }
})

Vue.config.silent = false

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

new Vue({
  render: h => h('frame', [h(Home)]),
  store: store,
}).$start();
