using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedIsActivePropertyToResidentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MiddleName",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "BarangayId",
                table: "Residents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Residents",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MunicipalityId",
                table: "Residents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Residents_BarangayId",
                table: "Residents",
                column: "BarangayId");

            migrationBuilder.CreateIndex(
                name: "IX_Residents_MunicipalityId",
                table: "Residents",
                column: "MunicipalityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Barangays_BarangayId",
                table: "Residents",
                column: "BarangayId",
                principalTable: "Barangays",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Municipalities_MunicipalityId",
                table: "Residents",
                column: "MunicipalityId",
                principalTable: "Municipalities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Barangays_BarangayId",
                table: "Residents");

            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Municipalities_MunicipalityId",
                table: "Residents");

            migrationBuilder.DropIndex(
                name: "IX_Residents_BarangayId",
                table: "Residents");

            migrationBuilder.DropIndex(
                name: "IX_Residents_MunicipalityId",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "BarangayId",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "MunicipalityId",
                table: "Residents");

            migrationBuilder.AlterColumn<string>(
                name: "MiddleName",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Residents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
