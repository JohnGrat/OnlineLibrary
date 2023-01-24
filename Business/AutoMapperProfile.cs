using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Business.Dtos;
using DataAccess.Models;

namespace Business
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Add your mappings here
            CreateMap<Book, BookDto>();
            CreateMap<Book, BookBriefDto>()
                .ForMember(b => b.AuthorsName, o => o.MapFrom(a => String.Join(",", a.Authors.Select(a => a.AuthorName))))
                .ForMember(b => b.LanguageName, o => o.MapFrom(a => a.Language.LanguageName));
        }
    }
}
