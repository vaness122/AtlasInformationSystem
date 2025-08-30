using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Core.Models
{
    public class Barangay
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Code { get; set; }
        public int MunicipalityId { get; set; } //Foreign Key of Municipality class

        public Municipality Municipality { get; set; }
        public ICollection<Zone> Zones { get; set; }
        public ICollection<AppUser> Admins { get; set; } = new List<AppUser>();
    }
}
