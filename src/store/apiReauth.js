// api.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./slices/data";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().data.accessToken || localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh token
    const refreshResult = await baseQuery(
      {
        url: "/api/user/refresh",
        method: "GET",
        credentials: "include",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // We got a new access token
      const { accessToken } = refreshResult.data;
      // Store the new token
      api.dispatch(
        setCredentials({
          accessToken,
        })
      );
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token is invalid, force logout
      await baseQuery(
        {
          url: "/api/user/logout",
          method: "GET",
          credentials: "include",
        },
        api,
        extraOptions
      );
      api.dispatch(logOut());
    }
  }

  return result;
};
