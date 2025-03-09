import { api } from "../api";
import { logOut, setCredentials } from "../slices/data";

const userMutations = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/api/user/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Login mutation failed:", error);
        }
      },
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/api/user/logout",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled}){
        try{
          await queryFulfilled
        }catch(err){
          console.log("Logout error", err);
        }finally {
          dispatch(logOut())
        }
      }
    })
  }),
});

export const { useLoginMutation, useLogOutMutation } = userMutations;
