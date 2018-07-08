using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MarsOnlineStore.Models;

namespace MarsOnlineStore.Controllers
{
    public class StoresController : Controller
    {
        
        // GET: Stores
        public ActionResult Index()
        {
            return View();
        }

        // GET: Stores
        [HttpGet]
        public JsonResult GetStores()
        {
            try
            {
                using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                {
                    List<Store> storeList = new List<Store>();
                    storeList = db.Stores.ToList();
                    return Json(new { success = true, storeList, responseText = "Successfully fetched Store!" }, JsonRequestBehavior.AllowGet);
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
        public JsonResult CreateStore(StoreAjaxModel createStore)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Store newStore = new Store() { Name = createStore.Name, Address = createStore.Address };
                        db.Stores.Add(newStore);
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully created Store!" }, JsonRequestBehavior.AllowGet);
                    }
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
            return Json(new { success = false, responseText = "Error: Skipped Try/Catch!" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public JsonResult EditStore(StoreAjaxModel editStore)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Store store = db.Stores.Where(storesDbTable => storesDbTable.Id == editStore.Id).Single();
                        store.Name = editStore.Name;
                        store.Address = editStore.Address;
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
        public JsonResult DeleteStore(StoreAjaxModel deleteStore) //Aware does not require entire Object (saves creating new model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (MarsOnlineStore2806Entities db = new MarsOnlineStore2806Entities())
                    {
                        Store store = db.Stores.Where(storesDbTable => storesDbTable.Id == deleteStore.Id).Single();
                        db.Stores.Remove(store);
                        db.SaveChanges();
                        return Json(new { success = true, responseText = "Successfully deleted Store!" }, JsonRequestBehavior.AllowGet);
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