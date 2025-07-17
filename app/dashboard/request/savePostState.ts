 type FieldErrors = {
  priority: string[]
  request: string[]
  quantity: string[]
  item_id: string[]
  remarks: string[]
}
 type SavePostState = {
  error: FieldErrors
  success: boolean
}
export const initialState: SavePostState = {
  error: {
    priority: [],
    request: [],
    quantity: [],
    item_id: [],
    remarks: []
  },
  success: false
}