import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  mobileMenuOpen: boolean
  toast: { message: string; type: "success" | "error" | "info" } | null
}

const initialState: UiState = {
  mobileMenuOpen: false,
  toast: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false
    },
    showToast(state, action: PayloadAction<UiState["toast"]>) {
      state.toast = action.payload
    },
    hideToast(state) {
      state.toast = null
    },
  },
})

export const { toggleMobileMenu, closeMobileMenu, showToast, hideToast } = uiSlice.actions
export default uiSlice.reducer
