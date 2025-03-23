import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

function getFromRoute(route){
  const url = "https://jsonplaceholder.typicode.com/"
  return fetch(`${url}${route}`).then(res => res.json());
}

function loadInitialData(){
    return { 
        isAuthenticated: localStorage.getItem("accessToken") ? true : false, 
        accessToken: localStorage.getItem("accessToken") || null, 
        allUsers: { status: "idle", data: [], error: null }, 
        allPosts: { status: "idle", data: [], error: null },
        user: localStorage.getItem("post_client_user") ? JSON.parse(localStorage.getItem("post_client_user")) : null
    } 
}

const dataSlice = createSlice({
    name: "user",
    initialState: loadInitialData(),
    reducers: {
        setCredentials: (state, action) => {
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("post_client_user", JSON.stringify(action.payload.user));
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        logOut: (state, action) => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("post_client_user");
            state.isAuthenticated = false;
            state.accessToken = null;
            state.user = null;
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