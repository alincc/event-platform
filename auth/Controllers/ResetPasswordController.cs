﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PolyHxDotNetServices.Mail;
using PolyHxDotNetServices.Mail.Inputs;
using STS.Inputs;
using STS.Interface;
using STS.Models;

namespace STS.Controllers
{
    [Route("resetPassword")]
    public class ResetPasswordController : Controller
    {
        private readonly IRepository _db;
        private readonly IMailService _mailService;

        public ResetPasswordController(IRepository db, IMailService mailService)
        {
            _db = db;
            _mailService = mailService;
        }

        [HttpPost]
        public IActionResult Create(AskResetPasswordInput input)
        {
            Task.Run(async () =>
            {
                Console.WriteLine("Sending the reset password email to the user");
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("The model isn't valid");
                    return;
                }

                var user = _db.Single<User>(c => c.Username.ToLower() == input.Username.ToLower());

                if (user == null)
                {
                    Console.WriteLine("No user found with this username {0}", input.Username);
                    return;
                }

                ResetPassword resetPassword;
                try
                {
                    resetPassword = _db.Single<ResetPassword>(c => c.UserId == user.Id && !c.Used);
                }
                catch (Exception)
                {
                    Console.WriteLine("An error occured while getting the reset password.");
                    resetPassword = null;
                }

                if (resetPassword == null)
                {
                    resetPassword = new ResetPassword
                    {
                        UserId = user.Id,
                        Uuid = Guid.NewGuid().ToString()
                    };

                    _db.Add(resetPassword);
                }
                else
                {
                    resetPassword.Uuid = Guid.NewGuid().ToString();
                    _db.Update<ResetPassword>(resetPassword.Id, new Dictionary<string, object>
                    {
                        {"Uuid", resetPassword.Uuid}
                    });
                }

                var mailInput = new SendMailInput
                {
                    From = "CS Games <support@csgames.org>",
                    To = new[] {user.Username},
                    Subject = "Réinitialisation du Mot de Passe | Password Reset",
                    Template = "password_reset",
                    Html = "<html></html>",
                    Text = "Text",
                    Variables = new Dictionary<string, string>
                    {
                        {"url", $"{Environment.GetEnvironmentVariable("RESET_PASSWORD_URL")}/{resetPassword.Uuid}"}
                    }
                };
                var res = await _mailService.SendEmail(mailInput);
                Console.WriteLine("The email was sent successfully");
            });
            return Ok();
        }

        [HttpGet("{uuid}")]
        public Task<IActionResult> IsValidUuid(string uuid)
        {
            return Task.Run<IActionResult>(() =>
            {
                var resetPassword = _db.Single<ResetPassword>(r => r.Uuid == uuid);

                if (resetPassword == null)
                    return BadRequest();

                if (resetPassword.Used)
                    return BadRequest();

                return Ok(new { });
            });
        }

        [HttpPut("{uuid}")]
        public Task<IActionResult> UpdatePassword(string uuid, ResetPasswordInput input)
        {
            return Task.Run<IActionResult>(() =>
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                if (!UserController.ValidatePassword(input.Password))
                {
                    return BadRequest(new
                    {
                        Message = "Password not valid"
                    });
                }

                var resetPassword = _db.Where<ResetPassword>(r => r.Uuid == uuid).First();

                if (resetPassword == null)
                    return BadRequest();

                if (resetPassword.Used)
                    return BadRequest();

                _db.Update<ResetPassword>(resetPassword.Id, new Dictionary<string, object>
                {
                    {"Used", true}
                });

                var hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(input.Password);
                _db.Update<User>(resetPassword.UserId, new Dictionary<string, object>
                {
                    {"Password", hashedNewPassword}
                });

                return Ok(new { });
            });
        }
    }
}