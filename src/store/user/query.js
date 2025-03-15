import { api } from "../api";

const userQueries = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/api/user/profile",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"]
    }),
  }),
});

export const { useGetProfileQuery } = userQueries;
