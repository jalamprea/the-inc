export function setActiveProvider (state, payload) {
  state.activeId = payload
}
export function logout (state) {
  state.activeId = ''
}
