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
      })
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/api/user/profile-update",
        method: "POST",
        credentials: "include",
        body
      }),
      invalidatesTags: ["User"]
    })
  }),
});

export const { useLoginMutation, useLogOutMutation, useSignupMutation, useUpdateProfileMutation } = userMutations;
