import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

function getFromRoute(route){
  const url = "https://jsonplaceholder.typicode.com/"
  return fetch(`${url}${route}`).then(res => res.json());
  
}

const dataSlice = createSlice({
    name: "user",
    initialState: { isActive: false, accessToken: localStorage.getItem("accessToken") || null, allUsers: { status: "idle", data: [], error: null }, allPosts: { status: "idle", data: [], error: null } },
    reducers: {
        activate: (state, action) => {
            state.isActive = action.payload
        },
        setCredentials: (state, action) => {
            localStorage.setItem("accessToken", action.payload.accessToken);
            state = { ...state, ...action.payload }
        },
        logOut: (state, action) => {
            localStorage.removeItem("accessToken")
            state.accessToken = null;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(getAllUsers.pending, (state, action) => {
            state.allUsers = { ...state.allUsers, status: "pending" }
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.allUsers = { data: action.payload, status: "fulfilled" }
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.allUsers = { ...state.allUsers, status: "error" }
        })
    }
});

export const getAllUsers = createAsyncThunk("fetch/getAllUsers", async () => {
    try{
        const result = await getFromRoute("users");

        return result;
    }catch(err){
        throw new Error(err.message);
    }
});

export const { setCredentials, logOut } = dataSlice.actions
export const dataReducer = dataSlice.reducer;