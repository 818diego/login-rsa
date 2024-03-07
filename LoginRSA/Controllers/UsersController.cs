using System.Numerics;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Context;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public int p = 113;
        public int q = 127;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        #region Login Usuario
        [HttpGet]
        [Route("Login")]
        public async Task<ActionResult<User>> GetUser(int userId, string password)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            string decryptedPassword = decryptPassword(user.PasswordEncrypted, user.d, p, q);

            if (password == decryptedPassword)
            {
                return Ok(user);
            }
            else
            {
                return Unauthorized();
            }
        }
        #endregion

        #region Registro Usuario
        [HttpPost]
        [Route("Registrar")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'AppDbContext.Users' is null.");
            }

            // Cifrar la contraseña antes de almacenarla
            string encryptedPassword = encryptPassword(user.PasswordEncrypted, p, q);
            user.PasswordEncrypted = encryptedPassword;

            // Calcular d
            BigInteger d = CalculateD(17, PhiFunction(p, q));

            // Asignar d al usuario
            user.d = (int)d;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.IdUser }, user);
        }
        #endregion

        #region Eliminar Usuario
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion

        #region Metodo RSA Encriptar
        static string encryptPassword(string password, BigInteger p, BigInteger q)
        {
            StringBuilder encryptedStringBuilder = new StringBuilder();

            BigInteger n = p * q;
            BigInteger e = 17;

            foreach (char character in password)
            {
                int asciiValue = (int)character;

                BigInteger encryptedMessage = BigInteger.ModPow(new BigInteger(asciiValue), e, n);

                encryptedStringBuilder.Append(encryptedMessage.ToString());
                encryptedStringBuilder.Append(" "); 
            }
            return encryptedStringBuilder.ToString().Trim();
        }
        #endregion

        #region Metodo Desencriptar
        static string decryptPassword(string encryptedPassword, BigInteger d, BigInteger p, BigInteger q)
        {
            StringBuilder decryptedStringBuilder = new StringBuilder();

            BigInteger n = p * q;

            string[] encryptedNumbers = encryptedPassword.Split(' ');

            foreach (string encryptedNumber in encryptedNumbers)
            {
                BigInteger encryptedLetter = BigInteger.Parse(encryptedNumber);
                BigInteger decryptedValue = BigInteger.ModPow(encryptedLetter, d, n);

                char decryptedLetter = (char)decryptedValue;
                decryptedStringBuilder.Append(decryptedLetter);
            }
            return decryptedStringBuilder.ToString();
        }
        #endregion

        #region Metoddos numericos para RSA
        static BigInteger PhiFunction(BigInteger p, BigInteger q)
        {
            return (p - 1) * (q - 1);
        }
        static BigInteger CalculateD(BigInteger a, BigInteger m)
        {
            BigInteger m0 = m;
            BigInteger y = 0;
            BigInteger x = 1;

            if (m == 1)
                return 0;

            while (a > 1)
            {
                BigInteger q = a / m;
                BigInteger t = m;

                m = a % m;
                a = t;
                t = y;

                y = x - q * y;
                x = t;
            }

            if (x < 0)
                x += m0;

            return x;
        }

        #endregion
    }
}