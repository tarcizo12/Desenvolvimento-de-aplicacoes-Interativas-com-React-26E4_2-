import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY = 'estoque-demo-user'

interface AuthState {
  displayName: string
}

const initialState: AuthState = {
  displayName: sessionStorage.getItem(STORAGE_KEY) ?? '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload.trim()
    },
    loggedOut: (state) => {
      state.displayName = ''
    },
  },
})

export const { loggedIn, loggedOut } = authSlice.actions
export default authSlice.reducer
