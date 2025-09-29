using Atlas.Core.Models.Residents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Core.Models
{
   public class Household
    {
        public int Id  { get; set; }
        public string HouseHoldName { get; set; }
        public ICollection<Resident> Residents { get; set; }
        public int ZoneId { get; set; }
        public Zone Zone { get; set; }
    }
}
