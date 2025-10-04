using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class removedhouseholdidtozonemodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Zones_Households_HouseholdId1",
                table: "Zones");

            migrationBuilder.DropIndex(
                name: "IX_Zones_HouseholdId1",
                table: "Zones");

            migrationBuilder.DropColumn(
                name: "HouseholdId",
                table: "Zones");

            migrationBuilder.DropColumn(
                name: "HouseholdId1",
                table: "Zones");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HouseholdId",
                table: "Zones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HouseholdId1",
                table: "Zones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Zones_HouseholdId1",
                table: "Zones",
                column: "HouseholdId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Zones_Households_HouseholdId1",
                table: "Zones",
                column: "HouseholdId1",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
