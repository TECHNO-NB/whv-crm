import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  fullName: string;
  countryId:string;
   email: string;
  countryName:string;
  role: string;
  code: string;
}

const initialState: userState = {
  id: "",
  fullName: "",
  email: "",
  role: "",
  countryName:"",
  countryId:"",
  code:"",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<userState>) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.countryName = action.payload.countryName;
       state.countryId = action.payload.countryId;
       state.code = action.payload.code;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
