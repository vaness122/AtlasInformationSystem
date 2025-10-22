using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Atlas.Shared.DTOs;
using AutoMapper;

namespace Atlas.BAL.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Zone mappings
            CreateMap<Zone, ZoneDto>().ReverseMap();
            CreateMap<CreateZoneDto, Zone>();
            CreateMap<UpdateZoneDto, Zone>();

            // Household mappings
            CreateMap<Household, HouseholdDto>().ReverseMap();
            CreateMap<CreateHouseholdDto, Household>();
            CreateMap<UpdateHouseholdDto, Household>();

            // Barangay mappings
            CreateMap<Barangay, BarangayDto>().ReverseMap();
            CreateMap<CreateBarangayDto, Barangay>();
            CreateMap<UpdateBarangayDto, Barangay>();

            // Municipality mappings
            CreateMap<Municipality, MunicipalityDto>().ReverseMap();
            CreateMap<CreateMunicipalityDto, Municipality>();
            CreateMap<UpdateMunicipalityDto, Municipality>();

            // Resident mappings
            CreateMap<Resident, ResidentDto>()
                   .ForMember(dest => dest.MunicipalityName, opt => opt.MapFrom(src => src.Municipality != null ? src.Municipality.Name : null))
                   .ForMember(dest => dest.BarangayName, opt => opt.MapFrom(src => src.Barangay != null ? src.Barangay.Name : null))
                   .ForMember(dest => dest.ZoneName, opt => opt.MapFrom(src => src.Zone != null ? src.Zone.Name : null))
                   .ForMember(dest => dest.HouseholdName, opt => opt.MapFrom(src => src.Household != null ? src.Household.HouseHoldName : null))
                   .ForMember(dest => dest.HouseholdId, opt => opt.MapFrom(src => src.HouseholdId)); // 

            CreateMap<ResidentDto, Resident>()
                .ForMember(dest => dest.Municipality, opt => opt.Ignore())
                .ForMember(dest => dest.Barangay, opt => opt.Ignore())
                .ForMember(dest => dest.Zone, opt => opt.Ignore())
                .ForMember(dest => dest.Household, opt => opt.Ignore());


            CreateMap<CreateResidentDto, Resident>()
                .ForMember(dest => dest.HouseholdId, opt => opt.MapFrom(src => src.HouseholdId));

            CreateMap<UpdateResidentDto, Resident>()
                .ForMember(dest => dest.HouseholdId, opt => opt.MapFrom(src => src.HouseholdId));
        }
    }
}