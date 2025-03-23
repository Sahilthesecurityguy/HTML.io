// script.js

$(function () { // Ensure DOM is ready
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

// Create namespace
(function (global) {

  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
  var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    var regex = new RegExp(propToReplace, "g");
    return string.replace(regex, propValue);
  };

  // TODO: STEP 1: On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,
      true); // JSON response
  });

  // TODO: STEP 2: Callback function
  function buildAndShowHomeHTML(categories) {
    // Load home snippet page
    $ajaxUtils.sendGetRequest(homeHtml, function (homeHtmlContent) {
      // TODO: STEP 3: Choose a random category from the response
      var randomCategory = chooseRandomCategory(categories);
      // Insert short_name into the home snippet
      var randomCategoryShortName = randomCategory.short_name;
      var homeHtmlToInsert = insertProperty(homeHtmlContent, "randomCategoryShortName", "'" + randomCategoryShortName + "'");
      // TODO: STEP 4: Insert the processed snippet into page
      insertHtml("#main-content", homeHtmlToInsert);
    }, false);
  }

  // TODO: STEP 3: Select a random category from the list
  function chooseRandomCategory(categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }

  global.$dc = dc;

})(window);
