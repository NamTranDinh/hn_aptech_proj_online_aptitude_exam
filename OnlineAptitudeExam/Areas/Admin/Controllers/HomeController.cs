﻿using OnlineAptitudeExam.Utils;
using System.Web.Mvc;

namespace OnlineAptitudeExam.Areas.Admin.Controllers
{
    public class HomeController : Controller
    {
        // GET: Admin/Home
        [Authentication(true)]
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Dashboard");
        }
    }
}