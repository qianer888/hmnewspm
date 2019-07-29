import Vue from 'vue'
import Router from 'vue-router'

// import A from 'A.vue';
// import Login from 'B.vue'
// import C from 'C.vue'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            // 路由的 ->组件的懒加载
            component: () =>
                import ('@/views/login')
        },
        {
            path: '/',
            name: 'home',
            // 路由的 ->组件的懒加载
            component: () =>
                import ('@/views/home')
        }
    ]
})