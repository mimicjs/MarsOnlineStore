using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MarsOnlineStore.Models;

namespace MarsOnlineStore.Controllers
{
    public class ProductsController : Controller
    {
        private MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities();

        public ActionResult Index()
        {
            return View();
        }

        // GET: Products
        [HttpGet]
        public JsonResult GetProducts()
        {
            try
            {
                using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                {
                    List<Product> productList = new List<Product>();
                    productList = db.Products.ToList();
                    return Json(new { success = true, productList, responseText = "Successfully fetched Product!" }, JsonRequestBehavior.AllowGet);
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
        public JsonResult CreateProduct(ProductAjaxModel createProduct)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Product newProduct = new Product() { Name = createProduct.Name, Price = createProduct.Price };
                        db.Products.Add(newProduct);
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully created Product!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { success = false, responseText = "Error: Could not create Product!" }, JsonRequestBehavior.AllowGet);
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
        public JsonResult EditProduct(ProductAjaxModel updateProduct)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Product product = db.Products.Where(productsDbTable => productsDbTable.Id == updateProduct.Id).Single();
                        product.Name = updateProduct.Name;
                        product.Price = updateProduct.Price;
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully updated Database!" }, JsonRequestBehavior.AllowGet);
                    }
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
        public ActionResult DeleteProduct(ProductAjaxModel deleteProduct) //Aware does not require entire Object (saves creating new model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Product product = db.Products.Where(productsDbTable => productsDbTable.Id == deleteProduct.Id).Single();
                        db.Products.Remove(product);
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully deleted Product!" }, JsonRequestBehavior.AllowGet);
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