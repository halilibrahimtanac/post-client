import { api } from "../api";

const userQueries = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/api/user/profile",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetProfileQuery } = userQueries;
