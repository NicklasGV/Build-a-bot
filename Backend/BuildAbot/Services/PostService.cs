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
                Content = post.Content,
                User = new UserPostResponse
                {
                    Id = post.User.Id,
                    UserName = post.User.UserName,
                    Email = post.User.Email.ToLower()
                },
                Comments = post.Comments
                            .Where(x => x.ParentCommentId == null)
                            .Select(x => new CommentPostResponse
                            {
                                Id = x.Id,
                                Text = x.Text,
                                CreatedAt = x.CreatedAt,
                                User = new UserCommentResponse
                                {
                                    Id = x.User.Id,
                                    UserName = x.User.UserName,
                                    Email = x.User.Email.ToLower()
                                },
                                Replies = x.ChildComments.Select(r => new CommentPostResponse
                                {
                                    Id = r.Id,
                                    Text = r.Text,
                                    ParentCommentId = r.ParentCommentId,
                                    CreatedAt = r.CreatedAt,
                                    User = new UserCommentResponse
                                    {
                                        Id = x.User.Id,
                                        UserName = x.User.UserName,
                                        Email = x.User.Email.ToLower()
                                    },
                                }).ToList()
                            }).ToList()
            };

            return response;
        }


        private static Bot MapBotRequestToBot(BotRequest botRequest)
        {
            Bot bot = new Bot
            {
                UserId = botRequest.UserId,
                Name = botRequest.Name,
                BotScripts = botRequest.ScriptIds?.Select(x => new BotScript
                {
                    ScriptId = x
                }).ToList() ?? new List<BotScript>()
            };
            return bot;
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
    }
}
