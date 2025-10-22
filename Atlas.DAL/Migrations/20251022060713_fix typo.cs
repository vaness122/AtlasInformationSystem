using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class fixtypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Households_HousholdId",
                table: "Residents");

            migrationBuilder.RenameColumn(
                name: "HousholdId",
                table: "Residents",
                newName: "HouseholdId");

            migrationBuilder.RenameIndex(
                name: "IX_Residents_HousholdId",
                table: "Residents",
                newName: "IX_Residents_HouseholdId");

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Households_HouseholdId",
                table: "Residents",
                column: "HouseholdId",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Households_HouseholdId",
                table: "Residents");

            migrationBuilder.RenameColumn(
                name: "HouseholdId",
                table: "Residents",
                newName: "HousholdId");

            migrationBuilder.RenameIndex(
                name: "IX_Residents_HouseholdId",
                table: "Residents",
                newName: "IX_Residents_HousholdId");

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Households_HousholdId",
                table: "Residents",
                column: "HousholdId",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
