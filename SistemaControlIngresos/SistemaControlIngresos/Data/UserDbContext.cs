using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SistemaControlIngresos.Models;
using System.Xml.Linq;

namespace SistemaControlIngresos.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { 
        }

        public DbSet<User> Users { get; set; }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await Users.FromSqlRaw("CALL GetUsers()").ToListAsync();
        }
        public async Task<bool> InsertUserAsync(string email, string password, string job, string rol)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL InsertUser (@p_Email, @p_Password, @p_Job, @p_Rol)",
                new MySqlParameter("@p_Email", email),
                new MySqlParameter("@p_Password", password),
                new MySqlParameter("@p_Job", job),
                new MySqlParameter("@p_Rol", rol)
            );

            return affectedRows > 0;
        }

        public async Task<bool> UpdateUserAsync(int id, string email, string password, string job, string rol, string status)
        {
            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL UpdateUser (@p_Id, @p_Email, @p_Password, @p_Job, @p_Rol, @p_Status)",
                new MySqlParameter("@p_Id", id),
                new MySqlParameter("@p_Email", email),
                new MySqlParameter("@p_Password", password),
                new MySqlParameter("@p_Job", job),
                new MySqlParameter("@p_Rol", rol),
                new MySqlParameter("@p_Status", status)
            );

            return affectedRows > 0;
        }

        public async Task<bool> VerifyUserPasswordAsync(string email, string password)
        {
            try
            {
                var result = await Users.FromSqlRaw(
                    "CALL VerifyUserPassword (@p_Email, @p_Password)",
                    new MySqlParameter("@p_Email", email),
                    new MySqlParameter("@p_Password", password)
                ).ToListAsync();


                return result.Count > 0 && result[0].status == "Active";
            }
            catch (InvalidOperationException ex)
            {
                return false;
            }
        }

        public async Task<bool> ToggleUserStatusAsync(int id)
        {

            var affectedRows = await Database.ExecuteSqlRawAsync(
                "CALL ToggleUserStatus (@p_Id)",
                new MySqlParameter("@p_Id", id)
            );

            return affectedRows > 0;
        }

    }
}
