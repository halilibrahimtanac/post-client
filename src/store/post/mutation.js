import { api } from "../api";

const postMutationEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    newPost: builder.mutation({
      query: (body) => ({
        url: "/api/post/new-post",
        method: "POST",
        credentials: "include",
        body: { newPost: body },
      }),
      onQueryStarted: async (
        newPost,
        { dispatch, queryFulfilled, getState }
      ) => {
        // Generate a temporary ID for the new post (optional)
        const tempId = Math.random().toString(36).substring(2);

        // Optimistically update the cache
        const patchResult = dispatch(
          api.util.updateQueryData("getAllPosts", undefined, (draftPosts) => {
            draftPosts.unshift({ ...newPost, id: parseInt(tempId) }); // Add the new post to the list
          })
        );

        try {
          // Wait for the mutation to complete
          const { data: savedPost } = await queryFulfilled;

          // Update the cache with the actual server response
          dispatch(
            api.util.updateQueryData("getAllPosts", undefined, (draftPosts) => {
              const index = draftPosts.findIndex((post) => post.id === parseInt(tempId));
              if (index !== -1) {
                draftPosts[index] = savedPost; // Replace the temporary post with the saved post
              }
            })
          );
        } catch (error) {
          // If the mutation fails, undo the optimistic update
          patchResult.undo();

          // Optionally handle the error
          if (error instanceof Error) {
            console.error('Failed to create post:', error.message);
          }
        }
      },
    }),
    deletePost: builder.mutation({
        query: (postId) => ({
            url: `/api/post/delete-post/${postId}`,
            method: "DELETE",
            credentials: "include"
        }),
        invalidatesTags: [{ type: "Post", id: "LIST"}]
    })
  }),
});

export const { useNewPostMutation, useDeletePostMutation } = postMutationEndpoints;
