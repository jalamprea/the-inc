export function setActiveCompany (state, payload) {
  state.activeId = payload
}
export function logout (state, payload) {
  state.activeId = ''
}
