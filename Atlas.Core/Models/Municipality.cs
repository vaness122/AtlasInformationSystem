using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Core.Models
{
    public class Municipality
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Region { get; set; }  
        public string Province { get; set; }

        public ICollection<Barangay> Barangays {  get; set; } = new List<Barangay>();
        public ICollection<AppUser> Admins { get; set; } = new List<AppUser>();


    }
}
  