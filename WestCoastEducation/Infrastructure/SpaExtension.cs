using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Net.Http.Headers;
using WestCoastEducation.Config;

namespace WestCoastEducation.Infrastructure
{
    public static class SpaExtension
    {
        public static IApplicationBuilder UseFrontend(this IApplicationBuilder app, FrontendType env)
        {
            if (env == FrontendType.SPA)
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
            }
            else
            {
                //Swagger
                app.UseCors();
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.RoutePrefix = "";
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                });
            }

            return app;
        }
    }
}