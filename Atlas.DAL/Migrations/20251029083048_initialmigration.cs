using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class initialmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Desciption",
                table: "Zones",
                newName: "Description");

            migrationBuilder.UpdateData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "Central zone of Adcadarao");

            migrationBuilder.UpdateData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "Northern zone of Adcadarao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Zones",
                newName: "Desciption");

            migrationBuilder.UpdateData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 1,
                column: "Desciption",
                value: null);

            migrationBuilder.UpdateData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 2,
                column: "Desciption",
                value: null);
        }
    }
}
