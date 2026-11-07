import authReducer, { loggedIn, loggedOut } from './authSlice'

describe('Redux auth slice', () => {
  it('updates the global session name and clears it on logout', () => {
    const initialState = { displayName: '' }
    const loggedInState = authReducer(initialState, loggedIn('Ada'))

    expect(loggedInState.displayName).toBe('Ada')
    expect(authReducer(loggedInState, loggedOut()).displayName).toBe('')
  })
})
