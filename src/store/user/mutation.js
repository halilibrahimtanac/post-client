import { api } from "../api";
import { logOut } from "../slices/data";

const userMutations = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/api/user/login",
        method: "POST",
        body,
      })
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/api/user/register",
        method: "POST",
        body: { user: body }
      })
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

export const { useLoginMutation, useLogOutMutation, useSignupMutation } = userMutations;
