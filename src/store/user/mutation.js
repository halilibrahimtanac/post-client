import { api } from "../api";
import { setCredentials } from "../slices/data";

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
  }),
});

export const { useLoginMutation } = userMutations;
