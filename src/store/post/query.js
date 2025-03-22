import { api } from "../api";

const tagProviderHelper = (result) => {
  let posts = result.posts && Array.isArray(result.posts) ? result.posts : result.posts ? [result.posts] : []
  const tags = posts.map((r) => ({ type: "Post", id: r.id }));
  return tags;
}

const transformerHelper = (responseData) => {
  return responseData.posts && Array.isArray(responseData.posts) ? responseData.posts : responseData.posts ? [responseData.posts] : []
}

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
      query: (username) => ({
        url: `/api/post/get-user-posts${username ? "/" + username : ""}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => transformerHelper(responseData),
      providesTags: (result) => tagProviderHelper(result),
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
      transformResponse: (responseData) => transformerHelper(responseData),
      providesTags: (result) => tagProviderHelper(result),
    })
  }),
});

export const { useGetAllPostsQuery, useGetUserPostsQuery, useGetRelatedPostsQuery , useGetPostQuery } = postQueryEndpoints

