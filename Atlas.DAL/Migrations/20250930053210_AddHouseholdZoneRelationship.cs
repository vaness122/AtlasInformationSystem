using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddHouseholdZoneRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "Households",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Zones_HouseholdId1",
                table: "Zones",
                column: "HouseholdId1");

            migrationBuilder.CreateIndex(
                name: "IX_Households_ZoneId",
                table: "Households",
                column: "ZoneId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ZoneId",
                table: "AspNetUsers",
                column: "ZoneId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Zones_ZoneId",
                table: "AspNetUsers",
                column: "ZoneId",
                principalTable: "Zones",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Households_Zones_ZoneId",
                table: "Households",
                column: "ZoneId",
                principalTable: "Zones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Zones_Households_HouseholdId1",
                table: "Zones",
                column: "HouseholdId1",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Zones_ZoneId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Households_Zones_ZoneId",
                table: "Households");

            migrationBuilder.DropForeignKey(
                name: "FK_Zones_Households_HouseholdId1",
                table: "Zones");

            migrationBuilder.DropIndex(
                name: "IX_Zones_HouseholdId1",
                table: "Zones");

            migrationBuilder.DropIndex(
                name: "IX_Households_ZoneId",
                table: "Households");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ZoneId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HouseholdId",
                table: "Zones");

            migrationBuilder.DropColumn(
                name: "HouseholdId1",
                table: "Zones");

            migrationBuilder.DropColumn(
                name: "ZoneId",
                table: "Households");

            migrationBuilder.DropColumn(
                name: "ZoneId",
                table: "AspNetUsers");
        }
    }
}
