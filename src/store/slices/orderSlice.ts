import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ConfiguratorState } from "@/types"

const initialState: ConfiguratorState = {
  step: 1,
  productType: "",
  dimensions: { width: "", height: "", depth: "" },
  material: "",
  color: "",
  finish: "",
  options: [],
  referenceFiles: [],
  name: "",
  email: "",
  phone: "",
  message: "",
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload
    },
    nextStep(state) {
      state.step += 1
    },
    prevStep(state) {
      state.step -= 1
    },
    updateField<K extends keyof ConfiguratorState>(
      state: ConfiguratorState,
      action: PayloadAction<{ field: K; value: ConfiguratorState[K] }>
    ) {
      state[action.payload.field] = action.payload.value
    },
    resetOrder() {
      return initialState
    },
  },
})

export const { setStep, nextStep, prevStep, updateField, resetOrder } = orderSlice.actions
export default orderSlice.reducer
