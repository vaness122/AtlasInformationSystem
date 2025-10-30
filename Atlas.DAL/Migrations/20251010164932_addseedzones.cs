using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class addseedzones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Zones",
                newName: "Description");

            migrationBuilder.InsertData(
                table: "Zones",
                columns: new[] { "Id", "BarangayId", "Desciption", "Name" },
                values: new object[,]
                {
                    { 1, 1, "Central zone of Adcadarao", "Zone 1" },
                    { 2, 1, "Northern zone of Adcadarao", "Zone 2" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Zones",
                newName: "Description");
        }
    }
}
