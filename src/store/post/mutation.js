import { api } from "../api";

const postMutationEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    newPost: builder.mutation({
      query: (body) => ({
        url: "/api/post/new-post",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/api/post/delete-post/${postId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    likePost: builder.mutation({
      query: ({ postId }) => ({
        url: `api/like/post-like/${postId}`,
        method: "POST",
        credentials: "include"
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "Post", id: arg.postId }]
      }
    }),
    editPost: builder.mutation({
      query: (body) => ({
        url: `api/post/edit`,
        method: "PATCH",
        credentials: "include",
        body
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "Post", id: "LIST" }]
      }
    })
  }),
});

export const { useNewPostMutation, useDeletePostMutation, useLikePostMutation, useEditPostMutation } =
  postMutationEndpoints;
