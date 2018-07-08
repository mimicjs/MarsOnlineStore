using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MarsOnlineStore.Models;

namespace MarsOnlineStore.Controllers
{
    public class CustomersController : Controller
    {

        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }

        // GET: Customers
        [HttpGet]
        public JsonResult GetCustomers()
        {
            try
            {
                using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                {
                    List<Customer> customerList = db.Customers.ToList();
                    return Json(new { success = true, customerList, responseText = "Successfully fetched Customer! " + customerList[0] }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                if (ex is System.Data.Entity.Core.EntityException)
                {
                    return Json(new { success = false, responseText = "Error: Database could not be accessed!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Unknown Exception caught!" }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public JsonResult CreateCustomer(CustomerAjaxModel createCustomer)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Customer newCustomer = new Customer() { Name = createCustomer.Name, Address = createCustomer.Address };
                        db.Customers.Add(newCustomer);
                        db.SaveChanges();
                    }
                        return Json(new { success = true, responseText = "Successfully created Customer!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Could not create Customer!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                if (ex is System.Data.Entity.Core.EntityException)
                {
                    return Json(new { success = false, responseText = "Error: Database/Entity Error" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Unknown Exception caught!" }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public JsonResult EditCustomer(CustomerAjaxModel updateCustomer)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Customer customer = db.Customers.Where(customersDbTable => customersDbTable.Id == updateCustomer.Id).Single();
                        customer.Name = updateCustomer.Name;
                        customer.Address = updateCustomer.Address;
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully updated Database!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Could not update Database! ", JsonRequestBehavior.AllowGet });
                }
            }
            catch (Exception ex)
            {
                if (ex is System.Data.Entity.Core.EntityException)
                {
                    return Json(new { success = false, responseText = "Error: Database/Entity Error!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Unknown Exception caught!" }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteCustomer(CustomerAjaxModel deleteCustomer) //Aware does not require entire Object (saves creating new model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Customer customer = db.Customers.Where(customersDbTable => customersDbTable.Id == deleteCustomer.Id).Single();
                        db.Customers.Remove(customer);
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully deleted Customer!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Could not update Database! ", JsonRequestBehavior.AllowGet });
                }
            }
            catch (Exception ex)
            {
                if (ex is System.Data.Entity.Core.EntityException)
                {
                    return Json(new { success = false, responseText = "Error: Database/Entity Error!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Unknown Exception caught!" }, JsonRequestBehavior.AllowGet);
                }
            }
        }
    }
}