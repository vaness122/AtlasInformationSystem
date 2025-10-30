using Atlas.Core.Enum;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Atlas.Shared.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }
        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string? PhoneNumber { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]  // This makes Role bind from string in JSON
        public UserRole Role { get; set; }

        public int? MunicipalityId { get; set; }
        public int? BarangayId { get; set; }
        public int? ZoneId { get; set; }
    }
}
