using Atlas.Core.Models.Residents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Core.Models
{
   public class Zone
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Desctiption { get; set; }
        public int BarangayId   { get; set; } //foreign key of barangay class
       


        public Barangay Barangay { get; set; }
        public ICollection<Household>Households { get; set; } = new List<Household>();
        public ICollection<Resident> Residents { get; set; } = new List<Resident>();

    }
}
