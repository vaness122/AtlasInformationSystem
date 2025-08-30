using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Atlas.DAL.DbContext
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {

        public AppDbContext(DbContextOptions<AppDbContext>options) :base(options) { }
        public DbSet<Municipality> Municipalities { get; set; }
        public DbSet<Barangay> Barangays { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet <Household> Households {  get; set; }
        public DbSet <Resident> Residents { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //Municipality-= Barangay
            builder.Entity<Barangay>()
                .HasOne(b => b.Municipality)
                .WithMany(m => m.Barangays)
                .HasForeignKey(b => b.MunicipalityId);

            //Barangay -= Zone
            builder.Entity<Zone>()
                .HasOne(z => z.Barangay)
                .WithMany(b => b.Zones)
                .HasForeignKey(z => z.BarangayId);

            //Resident - Household

                builder.Entity<Resident>()
                .HasOne( r => r.Household)
                .WithMany( h => h.Residents)
                .HasForeignKey(r => r.HousholdId);

            //AppUser - Municipality - Barangay
            builder.Entity<AppUser>()
                .HasOne(u => u.Municipality)
                .WithMany(m => m.Admins)
                .HasForeignKey(u => u.MunicipalityId);

            builder.Entity<AppUser>()
                .HasOne(u => u.Barangay)
                .WithMany(b => b.Admins)
                .HasForeignKey(u => u.BarangayId);

        }
    }
    
}
