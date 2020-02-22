export function setActiveCompany (state, payload) {
  state.activeId = payload
}
export function setStore (state, payload) {
  state.storeId = payload
}
export function logout (state) {
  state.activeId = ''
  state.storeId = ''
}
