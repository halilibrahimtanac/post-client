import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { dataReducer } from "./slices/data";

const errorMiddleware = (_storeAPI) => (next) => (action) => {
    // Option A: Check if action type ends with /rejected
    if (typeof action.type === 'string' && action.type.endsWith("/rejected")) {
      console.error("RTK Query rejected action:", action);
      const errorMessage = action.payload?.data?.error || "An error occurred!";
      // Using a type-safe way to show toast messages
      if (typeof window !== 'undefined' && 'addToast' in window) {
        window?.addToast(errorMessage, "error", 3000);
      }
      // do whatever custom error handling you need here
    }
  
    // Option B: Use RTK Query "matchers"
    // if (api.endpoints.someEndpoint.matchRejected(action)) {
    //   console.error('SomeEndpoint was rejected:', action.error);
    // }
  
    return next(action);
};

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        "data": dataReducer
    },

    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(api.middleware, errorMiddleware)
});

export default store;