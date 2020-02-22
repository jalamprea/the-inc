
const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/dashboard', name: 'dashboard', component: () => import('pages/Index.vue') },
      { path: '/crear', name: 'create', component: () => import('pages/CreateBill.vue') },
      { path: '/lista', name: 'list', component: () => import('pages/ListBill.vue') },
      { path: '/factura/:id', name: 'bill', props: true, component: () => import('pages/CheckBill.vue') },
      { path: '/inventario', name: 'inventory', component: () => import('pages/Inventory.vue') },
      { path: '/subir-csv', name: 'upload-csv', component: () => import('pages/UploadCSV.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/init/login.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
