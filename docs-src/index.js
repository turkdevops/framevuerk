import 'babel-polyfill'
import '../dist/framevuerk.css'
import 'highlight.js/styles/dark.css'
import 'font-awesome/css/font-awesome.css'
import './favicon.ico'

import Hammer from 'hammerjs'
import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import VueRouter from 'vue-router'

import Framevuerk from '../dist/framevuerk.js'

import main from './main.vue'

Framevuerk.use('hammer', Hammer)
Vue.use(VueRouter)
Vue.use(VueHighlightJS)
Vue.use(Framevuerk)

// Routes
const routes = require('./routes.js')('app')
const router =
    new VueRouter(
        {mode : process.env.NODE_ENV === 'production' ? 'history' : '', routes})

        new Vue({
          data() {
            return {
              mainClass:
                  [
                    'fv-col-lg-10', 'fv-col-offset-lg-1', 'fv-col-xl-8',
                    'fv-col-offset-xl-2'
                  ],
                  githubRepo: 'https://github.com/framevuerk/framevuerk',
                  npmRepo: 'https://www.npmjs.com/package/framevuerk'
            }
          },
          router,
          methods : {
            log(d1, d2, d3) { console.log(d1, d2, d3) },
            routeChange(path) {}
          },
          created() { this.routeChange(this.$route.path) },
          watch : {'$route.path'(path) { this.routeChange(path) }},
          render : h => h(main)
        }).$mount('#app')
