using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MarsOnlineStore.Models;

namespace MarsOnlineStore.Controllers
{
    public class SalesController : Controller
    {
        private MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities();
        private List<ProductSoldViewModel> salesList = new List<ProductSoldViewModel>();
        private ProductSold record = new ProductSold();

        private void convertToRecordNames() //All Records: From Id to Names
        {
            try
            {
                salesList.Clear();
                using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                {
                    
                }
                foreach (ProductSold productSold in db.ProductSolds.ToList())
                {

                    //TODO: Optimise speed by reducing requests through caching entire table

                    Product product = db.Products.Where(productsDbTable => productsDbTable.Id == productSold.ProductId).Single();
                    Customer customer = db.Customers.Where(customersDbTable => customersDbTable.Id == productSold.CustomerId).Single();
                    Store store = db.Stores.Where(storesDbTable => storesDbTable.Id == productSold.StoreId).Single();

                    salesList.Add(new ProductSoldViewModel()
                    {
                        Id = productSold.Id,
                        ProductName = product.Name,
                        CustomerName = customer.Name,
                        StoreName = store.Name,
                        DateSold = productSold.DateSold.ToString("dd/MM/yyyy")
                });
                }
            }
            catch (Exception ex)
            {
                if (ex is System.Data.Entity.Core.EntityException)
                {
                    //Notify SQL Server Unreachable
                }
                else
                {
                    //Other exceptions
                }
            }
        }

        private ProductSold convertNamesToItemIds(ProductSoldAjaxModel salesRecordNew) //1 Record: From Names back to Id
        {
            try
            {
                using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                {
                    Product product = db.Products.Where(productsDbTable => productsDbTable.Name == salesRecordNew.ProductName).Single();
                    Customer customer = db.Customers.Where(customersDbTable => customersDbTable.Name == salesRecordNew.CustomerName).Single();
                    Store store = db.Stores.Where(storesDbTable => storesDbTable.Name == salesRecordNew.StoreName).Single();

                    record = new ProductSold()
                    {
                        Id = salesRecordNew.Id,
                        ProductId = product.Id,
                        CustomerId = customer.Id,
                        StoreId = store.Id,
                        DateSold = salesRecordNew.DateSold //To Store on DB in C# form
                    };
                }
            }
            catch (Exception ex)
            {
                if (ex is System.Data.Entity.Core.EntityException)
                {
                    //Notify SQL Server Unreachable
                }
                else
                {
                    //Other exceptions
                }
            }
            return record;
        }

        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetSalesRecords()
        {
            try
            {
                convertToRecordNames();
                return Json(new { success = true, salesList, responseText = "Successfully fetched Sales!" }, JsonRequestBehavior.AllowGet);
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

        [HttpGet]
        public JsonResult GetSalesRecordsNameLists() //Collects & Returns: names of Customers, Products, and Stores
        {
            try
            {
                var productNamesList = db.Products.Select(productsDbTable => new { productsDbTable.Id, productsDbTable.Name }).ToList();
                var customerNamesList = db.Customers.Select(customersDbTable => new { customersDbTable.Id, customersDbTable.Name }).ToList();
                var storeNamesList = db.Stores.Select(storesDbTable => new { storesDbTable.Id, storesDbTable.Name }).ToList();
                return Json(new { success = true, productNamesList, customerNamesList, storeNamesList, responseText = "Successfully fetched Lists of Names!" }, JsonRequestBehavior.AllowGet);
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
        public JsonResult CreateSalesRecord(ProductSoldAjaxModel createSalesRecord)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    record = convertNamesToItemIds(createSalesRecord); //Returns ProductSold Object
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        db.ProductSolds.Add(new ProductSold()
                        {
                            Id = record.Id,
                            ProductId = record.ProductId,
                            CustomerId = record.CustomerId,
                            StoreId = record.StoreId,
                            DateSold = record.DateSold
                        });
                        db.SaveChanges();
                    }
                    return Json(new { success = true, responseText = "Successfully created Sales Record!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Could not create Sales Record!" }, JsonRequestBehavior.AllowGet);
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
        public ActionResult EditSalesRecord(ProductSoldAjaxModel salesRecordEdit)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    record = convertNamesToItemIds(salesRecordEdit); //Returns ProductSold Object
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        ProductSold productSold = db.ProductSolds.Where(productSoldsDB => productSoldsDB.Id == record.Id).Single();

                        //productSold.Id = record.Id;
                        productSold.ProductId = record.ProductId;
                        productSold.CustomerId = record.CustomerId;
                        productSold.StoreId = record.StoreId;
                        productSold.DateSold = record.DateSold;

                        db.SaveChanges();
                    }
                    return Json(new { success = true, responseText = "Successfully updated Database!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Could not update Database!" }, JsonRequestBehavior.AllowGet);
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
        public JsonResult DeleteSalesRecord(ProductSoldAjaxModel deleteSalesRecord) //Aware does not require entire Object (saves creating new model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        ProductSold productSold = db.ProductSolds.Where(productSoldsDB => productSoldsDB.Id == deleteSalesRecord.Id).Single();
                        db.ProductSolds.Remove(productSold);
                        db.SaveChanges();
                    }
                    return Json(new { success = true, responseText = "Successfully deleted Sales Record!" }, JsonRequestBehavior.AllowGet);
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