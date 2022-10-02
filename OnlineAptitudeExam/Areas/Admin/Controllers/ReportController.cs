﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;
using OnlineAptitudeExam.Models;
using OnlineAptitudeExam.Utils;
using PagedList;
using static OnlineAptitudeExam.Models.CustomModel;

namespace OnlineAptitudeExam.Areas.Admin.Controllers
{
    public class ReportController : Controller
    {

        private readonly OnlineAptitudeExamEntities db = new OnlineAptitudeExamEntities();
        // GET: Admin/Report
        [Authentication(true)]
        public ActionResult Index(bool isAjax = false)
        {
            ViewBag.isAjax = isAjax;
            return View();
        }

        // GET: Admin/Tests/GetData
        [Authentication(true)]
        [ValidateInput(false)]
        public ActionResult GetData(string sort, string order, string filter, string d_start, string d_end, int? page)
        {
            ViewBag.CurrentSort = sort;
            ViewBag.CurrentOrder = order;
            ViewBag.CurrentFilter = filter;
            ViewBag.CurrentDateStart = d_start;
            ViewBag.CurrentDateEnd = d_end;

            /*SELECT Test.id, Test.name, COUNT(Test.id)[total_user]
            FROM Test JOIN Exam on Test.id = Exam.test_id
            GROUP BY Test.id, Test.name;*/

            var testsReport = (from t in db.Tests 
                        join e in db.Exams on t.id equals e.test_id 
                        group t by t.id into g 
                        select g)
                        .ToList()
                        .Select(val => new TestReport(val.First().id, val.First().name, val.Count()));
            if (!string.IsNullOrEmpty(filter))
            {
                testsReport = testsReport.Where(s => s.name.Contains(filter));
            }
            if (!string.IsNullOrEmpty(order))
            {
                switch (sort)
                {
                    case SortHelper.NAME:
                        testsReport = SortHelper.IsAsc(order) ? testsReport.OrderBy(s => s.name) : testsReport.OrderByDescending(s => s.name);
                        break;
                    default:
                        testsReport = SortHelper.IsAsc(order) ? testsReport.OrderBy(s => s.id) : testsReport.OrderByDescending(s => s.id);
                        break;
                }
            }
            else testsReport = testsReport.OrderByDescending(s => s.id);

            int pageSize = 5;
            int pageNumber = (page == null || page < 1) ? 1 : (int)page;
            return View(testsReport.ToPagedList(pageNumber, pageSize));
        }
    }

  
}