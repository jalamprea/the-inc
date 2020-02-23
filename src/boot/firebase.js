// import * as configs from '../utils/firebase/configs.js'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage' // eslint-disable-line
import { firestorePlugin } from 'vuefire'

import firebaseConfig from '../conf/firebase.conf'

export default ({ router, Vue }) => {
  // User Firestore with vuefire npm
  Vue.use(firestorePlugin)

  // Initialize app
  // const currentConfig = process.env.firebaseConfig
  const currentConfig = firebaseConfig

  // if for checking if firebase config file exists
  if (currentConfig) {
    router.beforeEach((to, from, next) => {
      const firebaseAppExists = firebase.apps.length > 0
      if (!firebaseAppExists) {
        try {
          // try to initialize and create app variables
          firebase.initializeApp(currentConfig)
          const firestore = firebase.firestore()
          const storage = firebase.storage()
          const functions = firebase.functions()
          console.log('persistance')
          firebase.firestore().enablePersistence()
            .catch(err => {
              if (err.code === 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
              } else if (err.code === 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
              }
            })

          // Add props to our Vue instance for easy access in our app
          Vue.prototype.$firebase = firebase
          // apps
          Vue.prototype.$firestore = firestore
          Vue.prototype.$storage = storage
          Vue.prototype.$functions = functions
        } catch (err) {
          console.info(err)
          // if there's an error is because firebase is already initialized
        } finally {
          firebase.auth().onAuthStateChanged(user => {
            // finalmente inicializado y el valor de user es real
            // si es null es, UNA OPCION: porque no hay sesion anon/user
            if (user) {
              next()
            } else {
              const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
              if (requiresAuth) {
                next({ name: 'signin' })
              } else {
                next(to)
              }
            }
          })
        }
      } else {
        // Si llega acá es porque ya existe un usuario
        next()
      }
    })
  } else {
    console.error('No firebase config file found.')
  }

  // Add auth methods to the Vue instance

  Vue.prototype.$login = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  Vue.prototype.$logout = () => {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }

  Vue.prototype.$registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          resolve(user)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
export { firebase }
