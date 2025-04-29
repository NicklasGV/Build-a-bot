namespace BuildAbot.Services
{
    public class PostService : IPostService
    {
        public readonly IPostRepository _postRepository;

        public PostService(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public static PostResponse MapPostToPostResponse(Post post)
        {
            PostResponse response = new PostResponse
            {
                Id = post.Id,
                Title = post.Title,
                CreatedAt = post.CreatedAt,
                Content = post.Content,
                User = new UserPostResponse
                {
                    Id = post.User.Id,
                    UserName = post.User.UserName,
                    Email = post.User.Email.ToLower()
                },
                Comments = post.Comments
                            .Where(x => x.ParentCommentId == null)
                            .Select(MapCommentToResponse)
                            .ToList()
            };

            return response;
        }


        public static CommentPostResponse MapCommentToResponse(Comment comment)
        {
            var response = new CommentPostResponse
            {
                Id = comment.Id,
                Text = comment.Text,
                CreatedAt = comment.CreatedAt,
                ParentCommentId = comment.ParentCommentId,
                User = new UserCommentResponse
                {
                    Id = comment.User.Id,
                    UserName = comment.User.UserName,
                    Email = comment.User.Email.ToLower()
                },
                Replies = comment.ChildComments != null && comment.ChildComments.Any()
                          ? comment.ChildComments.Select(MapCommentToResponse).ToList()
                          : new List<CommentPostResponse>()
            };

            return response;
        }


        private static Post MapPostRequestToPost(PostRequest postRequest)
        {
            Post post = new Post
            {
                UserId = postRequest.UserId,
                Title = postRequest.Title,
                Content = postRequest.Content,
                CreatedAt = postRequest.CreatedAt
            };
            return post;
        }

        public async Task<List<PostResponse>> GetAllAsync()
        {
            List<Post> posts = await _postRepository.GetAllAsync();

            if (posts == null)
            {
                throw new ArgumentException();
            }
            return posts.Select(MapPostToPostResponse).ToList();

        }

        public async Task<PostResponse?> FindByIdAsync(int postId)
        {
            var post = await _postRepository.FindByIdAsync(postId);

            if (post != null)
            {
                return MapPostToPostResponse(post);
            }

            return null;
        }

        public async Task<PostResponse> CreateAsync(PostRequest postRequest)
        {
            Post newPost = MapPostRequestToPost(postRequest);
            newPost = await _postRepository.CreateAsync(newPost);
            return MapPostToPostResponse(newPost);
        }

        public async Task<PostResponse> UpdateByIdAsync(int postId, PostRequest postRequest)
        {
            Post updatePost = MapPostRequestToPost(postRequest);
            Post post = await _postRepository.UpdateByIdAsync(postId, updatePost);
            return MapPostToPostResponse(post);
        }

        public async Task<PostResponse> DeleteByIdAsync(int postId)
        {
            var post = await _postRepository.DeleteByIdAsync(postId);
            return MapPostToPostResponse(post);
        }
    }
}
