using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Shared.DTOs
{
    public class BarangayDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int MunicipalityId { get; set; }
        public string MunicipalityName { get; set; } = string.Empty;
    }

    public class CreateBarangayDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int MunicipalityId { get; set; }
    }

    public class UpdateBarangayDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}
