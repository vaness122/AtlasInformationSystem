using Atlas.Core.Enum;
using Atlas.Core.Models;
using Atlas.Core.Models.Residents;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
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

            //seed roles 
            builder.Entity<IdentityRole>().HasData(

                new IdentityRole
                {
                    Id = "rsmMUtszCCLSNc0bJNiBtdz4paGSTwZeCPNj",
                    Name = UserRole.SuperAdmin.ToString(),
                    NormalizedName = UserRole.SuperAdmin.ToString().ToUpper(),
                    ConcurrencyStamp = "d8a1d207-a0e5-4f05-6a3a-e5dc7f76a0e5"
                },

                new IdentityRole
                {
                    Id = "Yj4kt6XngO61zUD8rMpPfdrMXPu2AXrNMT7g",
                    Name = UserRole.MunicipalityAdmin.ToString(),
                    NormalizedName = UserRole.MunicipalityAdmin.ToString().ToUpper(),
                    ConcurrencyStamp = "5d6e2b1e-4f39-8d1d-7b7a-9a4a7285b7a4"
                },

                new IdentityRole
                {
                    Id = "r4KUkkswHMqZDNObPzc1pq1cDfBudAe5bMnj",
                    Name = UserRole.BarangayAdmin.ToString(),
                    NormalizedName = UserRole.BarangayAdmin.ToString().ToUpper(),
                    ConcurrencyStamp = "5d6e2b1e-4a72-85a7-5d6e-3b1e3a4f4a72"
                },

                new IdentityRole
                {
                    Id = "2rUWb3SKcw2ylyArBxEynQbHHX6ItgPRjcZI",
                    Name = UserRole.Resident.ToString(),
                    NormalizedName = UserRole.Resident.ToString().ToUpper(),
                    ConcurrencyStamp = "b7a49a4a-4a72-85a7-5d6e-2b1e3a4f5d6e"


                }
                
                
                
                );

            

            //Municipality-= Barangay
            builder.Entity<Barangay>()
                .HasOne(b => b.Municipality)
                .WithMany(m => m.Barangays)
                .HasForeignKey(b => b.MunicipalityId)
                .OnDelete(DeleteBehavior.Restrict);

            //Barangay -= Zone
            builder.Entity<Zone>()
                .HasOne(z => z.Barangay)
                .WithMany(b => b.Zones)
                .HasForeignKey(z => z.BarangayId)
                .OnDelete(DeleteBehavior.Restrict);

            //Resident - Household

            builder.Entity<Resident>()
            .HasOne(r => r.Household)
            .WithMany(h => h.Residents)
            .HasForeignKey(r => r.HouseholdId)
            .OnDelete(DeleteBehavior.Restrict);

            // Household - Zone relationship
            builder.Entity<Household>()
                .HasOne(h => h.Zone)
                .WithMany(z => z.Households)
                .HasForeignKey(h => h.ZoneId)
                .OnDelete(DeleteBehavior.Restrict);



            //AppUser - Municipality - Barangay
            builder.Entity<AppUser>()
                .HasOne(u => u.Municipality)
                .WithMany(m => m.Admins)
                .HasForeignKey(u => u.MunicipalityId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict); 

            builder.Entity<AppUser>()
                .HasOne(u => u.Barangay)
                .WithMany(b => b.Admins)
                .HasForeignKey(u => u.BarangayId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AppUser>()
                .HasOne(u => u.Zone)
                .WithMany()
                .HasForeignKey(u => u.ZoneId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);




            //Seeding Iloilo Municipality

            builder.Entity<Municipality>().HasData(
                new Municipality
                {
                    Id = 1,
                    Name = "Ajuy",
                    Code = "AJY",
                    Region = "Region VI (Western Visayas)",
                    Province = "Iloilo"

                }


                );

           
                
                
               

            builder.Entity<Barangay>().HasData(
        new Barangay
        {
            Id = 1,
            Name = "Adcadarao",
            Code = "ADC",
            MunicipalityId = 1
        }
    );


            builder.Entity<Zone>().HasData(
       new Zone
       {
           Id = 1,
           Name = "Zone 1",
           Description = "Central zone of Adcadarao",
           BarangayId = 1
       },
       new Zone
       {
           Id = 2,
           Name = "Zone 2",
           Description = "Northern zone of Adcadarao",
           BarangayId = 1
       }
   );





        }
    }

}
