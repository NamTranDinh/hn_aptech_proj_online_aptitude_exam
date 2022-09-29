﻿using OnlineAptitudeExam.Utils;
using System.Web.Mvc;

namespace OnlineAptitudeExam.Areas.Admin.Controllers
{
    public class AccountsController : Controller
    {
        // GET: Admin/Accounts
        [Authentication(true)]
        public ActionResult Index(bool isAjax = false)
        {
            ViewBag.isAjax = isAjax;
            return View();
        }
    }
}