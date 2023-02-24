using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Net.Http.Headers;
using WestCoastEducation.Config;

namespace WestCoastEducation.Infrastructure
{
    public static class FrontendExtensions
    {
        public static IApplicationBuilder UseSpaConfiguration(this IApplicationBuilder app)
        {
                //Spa
                app.UseSpaStaticFiles();
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";
                    spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
                    {
                        OnPrepareResponse = ctx =>
                        {
                            ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                            headers.CacheControl = new CacheControlHeaderValue
                            {
                                NoCache = true,
                                NoStore = true,
                                MustRevalidate = true
                            };
                        }
                    };
                });
            return app;
        }

        public static IApplicationBuilder UseSwaggerConfiguration(this IApplicationBuilder app)
        {
            //Swagger
            app.UseCors();
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.RoutePrefix = "";
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
            });

            return app;
        }
    }
}