﻿using System.Web.Mvc;

namespace OnlineAptitudeExam.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {

            context.MapRoute(
                "Admin_default",
                "Admin/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new[] { "OnlineAptitudeExam.Areas.Admin.Controllers" }
            );

            context.MapRoute(
              "Admin_ajax",
              "Ajax/Admin/{controller}/{action}/{id}",
              new { controller = "Home", action = "Index", id = UrlParameter.Optional, isAjax = true }
          );

        }
    }
}