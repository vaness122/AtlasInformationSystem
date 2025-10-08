using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class SeedIloiloData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Municipalities",
                columns: new[] { "Id", "Code", "Name", "Province", "Region" },
                values: new object[] { 1, "AJY", "Ajuy", "Iloilo", "Region VI (Western Visayas)" });

            migrationBuilder.InsertData(
                table: "Barangays",
                columns: new[] { "Id", "Code", "MunicipalityId", "Name" },
                values: new object[] { 1, "ADC", 1, "Adcadarao" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Barangays",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Municipalities",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
