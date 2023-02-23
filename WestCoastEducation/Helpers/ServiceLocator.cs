namespace WestCoastEducation.Helpers
{
    public static class ServiceLocator
    {
        private static IServiceProvider _serviceProvider;

        public static void Initialize(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public static T GetService<T>()
        {
            return (T)_serviceProvider.GetService(typeof(T));
        }
    }
}