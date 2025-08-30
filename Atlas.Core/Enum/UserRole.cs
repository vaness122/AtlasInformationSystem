using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.Core.Enum
{
    public enum UserRole
    {
           SuperAdmin, //Full Access
            MunicipalityAdmin, // Manages Municipality
            BarangayAdmin , //Manages Barangay
            Resident //Read-only Access
    }
}
