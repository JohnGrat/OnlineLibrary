using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Repositories
{
    public interface IRepository<T, TU>
    {
        Task<T> GetByIdAsync(object id);
        Task<IEnumerable<TU>> GetAllAsync(string? sort, string? filter, int? page, int? pageSize);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<T> DeleteAsync(object id);
    }
}
