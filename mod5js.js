(function (global) {
  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = 
    "https://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = 
    "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of {{propName}} with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    var regex = new RegExp(propToReplace, "g");
    string = string.replace(regex, propValue);
    return string;
  };

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    // STEP 0: 
    // Look over the code from 
    // *** start ***
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (categories) {
        // TODO: STEP 1: Make a random category index from 0 to categories.length-1
        var randomIndex = Math.floor(Math.random() * categories.length);

        // TODO: STEP 2: Get the category short_name from the random index
        var randomCategoryShortName = categories[randomIndex].short_name;

        // TODO: STEP 3: Substitute {{randomCategoryShortName}} in home snippet
        $ajaxUtils.sendGetRequest(
          homeHtml,
          function (homeHtmlContent) {
            var homeHtmlToInsert = insertProperty(homeHtmlContent, "randomCategoryShortName", randomCategoryShortName);

            // TODO: STEP 4: Insert the substituted homeHtml into #main-content
            insertHtml("#main-content", homeHtmlToInsert);
          },
          false
        );
      },
      true
    );
    // *** end ***
  });

  // Load the menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML
    );
  };

  // Load the menu items view
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort,
      buildAndShowMenuItemsHTML
    );
  };

  // Builds HTML for categories page
  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtmlContent) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtmlContent) {
            var categoriesViewHtml =
              buildCategoriesViewHtml(categories,
                categoriesTitleHtmlContent,
                categoryHtmlContent);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;

      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for single category page
  function buildAndShowMenuItemsHTML(menuItemsData) {
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtmlContent) {
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtmlContent) {
            var menuItemsViewHtml =
              buildMenuItemsViewHtml(menuItemsData,
                menuItemsTitleHtmlContent,
                menuItemHtmlContent);
            insertHtml("#main-content", menuItemsViewHtml);
          },
          false);
      },
      false);
  }

  function buildMenuItemsViewHtml(menuItemsData, menuItemsTitleHtml, menuItemHtml) {
    menuItemsTitleHtml =
      insertProperty(menuItemsTitleHtml,
        "name",
        menuItemsData.category.name);
    menuItemsTitleHtml =
      insertProperty(menuItemsTitleHtml,
        "special_instructions",
        menuItemsData.category.special_instructions);

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    var menuItems = menuItemsData.menu_items;
    var catShortName = menuItemsData.category.short_name;

    for (var i = 0; i < menuItems.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  global.$dc = dc;

})(window);
