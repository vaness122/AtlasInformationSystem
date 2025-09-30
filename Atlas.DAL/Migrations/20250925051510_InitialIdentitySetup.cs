using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class InitialIdentitySetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Barangays_BarangayId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Municipalities_MunicipalityId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Barangays_Municipalities_MunicipalityId",
                table: "Barangays");

            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Households_HousholdId",
                table: "Residents");

            migrationBuilder.DropForeignKey(
                name: "FK_Zones_Barangays_BarangayId",
                table: "Zones");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2rUWb3SKcw2ylyArBxEynQbHHX6ItgPRjcZI", "b7a49a4a-4a72-85a7-5d6e-2b1e3a4f5d6e", "Resident", "RESIDENT" },
                    { "r4KUkkswHMqZDNObPzc1pq1cDfBudAe5bMnj", "5d6e2b1e-4a72-85a7-5d6e-3b1e3a4f4a72", "BarangayAdmin", "BARANGAYADMIN" },
                    { "rsmMUtszCCLSNc0bJNiBtdz4paGSTwZeCPNj", "d8a1d207-a0e5-4f05-6a3a-e5dc7f76a0e5", "SuperAdmin", "SUPERADMIN" },
                    { "Yj4kt6XngO61zUD8rMpPfdrMXPu2AXrNMT7g", "5d6e2b1e-4f39-8d1d-7b7a-9a4a7285b7a4", "MunicipalityAdmin", "MUNICIPALITYADMIN" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Barangays_BarangayId",
                table: "AspNetUsers",
                column: "BarangayId",
                principalTable: "Barangays",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Municipalities_MunicipalityId",
                table: "AspNetUsers",
                column: "MunicipalityId",
                principalTable: "Municipalities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Barangays_Municipalities_MunicipalityId",
                table: "Barangays",
                column: "MunicipalityId",
                principalTable: "Municipalities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Households_HousholdId",
                table: "Residents",
                column: "HousholdId",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Zones_Barangays_BarangayId",
                table: "Zones",
                column: "BarangayId",
                principalTable: "Barangays",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Barangays_BarangayId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Municipalities_MunicipalityId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Barangays_Municipalities_MunicipalityId",
                table: "Barangays");

            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Households_HousholdId",
                table: "Residents");

            migrationBuilder.DropForeignKey(
                name: "FK_Zones_Barangays_BarangayId",
                table: "Zones");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2rUWb3SKcw2ylyArBxEynQbHHX6ItgPRjcZI");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "r4KUkkswHMqZDNObPzc1pq1cDfBudAe5bMnj");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "rsmMUtszCCLSNc0bJNiBtdz4paGSTwZeCPNj");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "Yj4kt6XngO61zUD8rMpPfdrMXPu2AXrNMT7g");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Barangays_BarangayId",
                table: "AspNetUsers",
                column: "BarangayId",
                principalTable: "Barangays",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Municipalities_MunicipalityId",
                table: "AspNetUsers",
                column: "MunicipalityId",
                principalTable: "Municipalities",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Barangays_Municipalities_MunicipalityId",
                table: "Barangays",
                column: "MunicipalityId",
                principalTable: "Municipalities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Households_HousholdId",
                table: "Residents",
                column: "HousholdId",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Zones_Barangays_BarangayId",
                table: "Zones",
                column: "BarangayId",
                principalTable: "Barangays",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
