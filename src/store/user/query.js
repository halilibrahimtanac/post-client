import { api } from "../api";

const userQueries = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (username) => ({
        url: `/api/user/profile${username ? "/" + username : ""}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"]
    }),
  }),
});

export const { useGetProfileQuery } = userQueries;
