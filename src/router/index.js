import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login",'/Login',"Login"),  //login路径,路由到登录组件
    {
      path:"/",   //根路径,路由到leyou的组件
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[    //其他所有的组件,都是leyou的子组件
        route("/index/dashboard","/Dashboard","Dashboard"),
        // 第一个参数: 路径, 第二个参数: 对应组件的位置
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/MyBrand',"Brand"),
        route("/item/list",'/item/Goods',"Goods"),
        route("/item/specification",'/item/Specification',"Specification"),
        route("/user/statistics",'/item/Statistics',"Statistics"),
        route("/trade/promotion",'/trade/Promotion',"Promotion")
      ]
    }
  ]
})
