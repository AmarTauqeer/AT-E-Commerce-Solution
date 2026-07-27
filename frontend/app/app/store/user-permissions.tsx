import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface PermissionState {
    id: number,
    resource: number,
    Read: boolean,
    Write: boolean,
    Update: boolean,
    Delete: boolean,
}


const permissionSlice = createSlice({
    name: 'permission',
    initialState: [] as PermissionState[],
    reducers: {
        addToPermission(state, action: PayloadAction<any>) {
            state.push(action.payload)
        },
        resetPermission: (state) => {
            return [];
        },
    }
})

export const { addToPermission, resetPermission } = permissionSlice.actions
export default permissionSlice.reducer; 