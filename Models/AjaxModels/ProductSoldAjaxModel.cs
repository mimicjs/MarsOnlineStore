using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations;

namespace MarsOnlineStore.Models
{
    public class ProductSoldAjaxModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        public string CustomerName { get; set; }
        [Required]
        public string StoreName { get; set; }
        [Required]
        public DateTime DateSold { get; set; }
        public string __RequestVerificationToken { get; set; }

    }
}