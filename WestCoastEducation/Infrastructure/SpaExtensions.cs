using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Net.Http.Headers;
using WestCoastEducation.Config;

namespace WestCoastEducation.Infrastructure
{
    public static class SpaExtensions
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

       
    }
}