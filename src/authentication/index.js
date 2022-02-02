import FpSdk from 'forepaas/sdk'
import LoginSelector from './LoginSelector.jsx'
import StandardLogin from './StandardLogin.jsx'

export default {
  components: {
    LoginSelector,
    StandardLogin
  },
  init() {
    for (let component in this.components) {
      FpSdk.modules['client-authority-manager'][`Fp${component}`] = this.components[component]
    }
  }
}

