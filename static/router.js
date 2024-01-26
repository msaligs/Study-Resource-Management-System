import home from "./components/home.js";
import login from "./components/login.js";
import AdminHome from "./components/AdminHome.js";
import StudHome from "./components/StudHome.js";
import InstHome from "./components/InstHome.js";
import Register from "./components/Register.js";
import Users from "./components/Users.js";
import Resources from "./components/Resources.js";
import CreateResource from "./components/CreateResource.js";

const routes = [
    { name:'home', path: '/', component: home },
    { name:'login',  path: '/login', component: login },
    { name:'Register',  path: '/Register', component: Register },
    { name:'adminHome',  path: '/AdminHome', component: AdminHome, meta:{ requiresAuth:true, requiredRoles: ['admin'] } },
    { name:'StudHome',  path: '/StudHome', component: StudHome, meta: { requiresAuth: true, requiredRoles: ['stud'] } },
    { name:'InstHome', path: '/InstHome', component: InstHome, meta:{ requiresAuth:true, requiredRoles: ['inst']} },
    { name:'users', path: '/users', component: Users, meta:{ requiresAuth:true, requiredRoles: ['admin']} },
    { name:'CreateResource', path: '/CreateResource', component: CreateResource, meta:{ requiresAuth:true, requiredRoles: ['stud']} },
    { name:'resources', path: '/resources', component: Resources },

]

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth-token') !== null;
    const userRoles = localStorage.getItem('roles')

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' }); 
    } else {
        const requiredRoles= to.meta.requiredRoles;
        if ( requiredRoles && !requiredRoles.some(role => userRoles.includes(role))){
            next({name:from.name, query:{error:"Unauthorise"}})
        }else{
            next();
        }
    }
  } else {
    next();
  }
});


export default router;