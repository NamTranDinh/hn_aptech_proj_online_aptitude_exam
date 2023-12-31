﻿using System.Web.Mvc;
using System.Web.Routing;

namespace OnlineAptitudeExam
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new[] { "OnlineAptitudeExam.Controllers" }
            );

            routes.MapRoute(
               name: "Question",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Home", action = "QuestionExam", id = UrlParameter.Optional },
               new[] { "OnlineAptitudeExam.Controllers" }
           );
        }
    }
}
