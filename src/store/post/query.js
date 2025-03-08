import { api } from "../api";

export const postQueryEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: () => ({
        url: "/api/post/get-all-posts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => {
        const tags = result?.posts ? result.posts.map((r) => ({ type: "Post", id: r.id })) : [];
        return [...tags, { type: "Post", id: "LIST" }];
      },
    }),
    getUserPosts: builder.query({
      query: () => ({
        url: "/api/post/get-user-posts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => {
        const tags = result.map((r) => ({ type: "Post", id: r.id }));
        return tags;
      },
    }),
    getPost: builder.query({
      query: (postId) => ({
        url: `/api/post/get-post/${postId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, err, arg) => [{ type: "Post", id: arg }]
    }),
    getRelatedPosts: builder.query({
      query: (postId) => ({
        url: `/api/post/get-related-posts/${postId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => {
        const tags = result.map((r) => ({ type: "Post", id: r.id }));
        return tags;
      },
    })
  }),
});

export const { useGetAllPostsQuery, useGetUserPostsQuery, useGetRelatedPostsQuery , useGetPostQuery } = postQueryEndpoints

