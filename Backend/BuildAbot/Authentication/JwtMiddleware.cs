namespace BuildAbot.Authentication
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserRepository userRepository, IJwtUtils jwtUtils)
        {
            string token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            int? userId = jwtUtils.ValidateJwtToken(token);
            if (userId is not null)
            {
                //Attach account to context on succesful jwt validation
                var user = await userRepository.FindByIdAsync(userId.Value);
                context.Items["User"] = UserService.MapUserToUserResponse(user);
            }

            await _next(context);
        }
    }
}
