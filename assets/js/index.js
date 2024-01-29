/** @format */
/// <reference types="../@types/jquery"/>
//apis
let meals = document.getElementById("meals");
let searchContainer = document.getElementById("searchContainer");


//___________________________glopal___________________________________//

// clear Meals
function clearDefaultMeals() {
  meals.innerHTML = "";
}
function clearSearchCotainer() {
  searchContainer.innerHTML = "";
}
//___________________________preLOader___________________________________//

$(document).ready(() => {
  defaultDisplay("");
  $(".loading-screen").fadeOut(500);
  $("body").css("overflow", "visible");
});

function fadeIn() {
  $(".inner-loading-screen").fadeIn(300);
}
function fadeOut() {
  $(".inner-loading-screen").fadeOut(300);
}
//______________________________________________________________________//
//___________________________SIDE NAV___________________________________//
//______________________________________________________________________//
$(".nav-link").on("click", function () {
  closeSideNav();
});

function openSideNav() {
  $(".side-nav").removeClass("start");
  $(".side-nav").animate({ left: 0 }, 500);
  $(".menue-icon").removeClass("fa-align-justify");
  $(".menue-icon").addClass("fa-x");
  for (let i = 0; i < 5; i++) {
    $(".nav-links-container li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}

function closeSideNav() {
  let left = $(".side-nav .links-container").outerWidth();
  $(".side-nav").animate({ left: -left }, 500);
  $(".menue-icon").addClass("fa-align-justify");
  $(".menue-icon").removeClass("fa-x");

  $(".nav-links-container li").animate({ top: 300 }, 500);
}

closeSideNav();
$(".side-nav i.menue-icon").click(() => {
  if ($(".side-nav").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});
//______________________________________________________________________//
//________________________side-nav-actions______________________________//
//______________________________________________________________________//

$(".search-link").on("click", function () {
  displaySearch();
});
$(".categories-link").on("click", function () {
  getCategories();
});
$(".area-link").on("click", function () {
  getAreas();
});
$(".ing-link").on("click", function () {
  getIngrediants();
});
$(".contact-link").on("click", function () {
  showinputs();
});

//______________________________________________________________________//
//___________________________Meals___________________________________//
//______________________________________________________________________//
// default display
async function defaultDisplay(term) {
  $("#contact").addClass("d-none")
  clearSearchCotainer();
  fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let finalresponse = await response.json();
  displayMeals(finalresponse.meals);
  fadeOut();
}
defaultDisplay("");
// display Meals
function displayMeals(a) {
  $("#contact").addClass("d-none")
  let cartoona = "";
  for (let i = 0; i < a.length; i++) {
    cartoona += `
      <div class="col-lg-3 col-md-4 col-sm-12 gy-4">
        <div class="meal rounded-2 pointer" onclick="getMealingreds('${a[i].idMeal}')">
          <img src="${a[i].strMealThumb}" alt="meal">
          <div class="layer">
            <h3>${a[i].strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }
  $("#meals").html(cartoona);

}

//___________________________NavLink(search)___________________________________//
// display search inputs
function displaySearch() {
  $("#contact").addClass("d-none")
  clearDefaultMeals();
  searchContainer.innerHTML = `
        <div class="col-md-6 ">
            <input onkeyup="searchByName(event)" class="form-control search" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(event)" class="form-control search" type="text" placeholder="Search By First Letter">
        </div>`;
}
//NavLink(searchByName)
async function searchByName(e) {
   closeSideNav();
  inputValue = e.target.value;
  closeSideNav();
  fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
  );
  let finalresponse = await response.json();
  if (finalresponse.meals) {
    displayMeals(finalresponse.meals);
    fadeOut();
  } else {
    displayMeals([]);
  }
}
//NavLink(searchByFirstLetter)
async function searchByFirstLetter(e) {
   closeSideNav();
  let inputValue = e.target.value;
  closeSideNav();
  if (inputValue == "") {
    inputValue = "a";
  }
  fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${inputValue}`
  );
  let finalresponse = await response.json();
  if (finalresponse.meals) {
    displayMeals(finalresponse.meals);
    fadeOut()
  } else {
    displayMeals([]);
  }

}

//___________________________Categories___________________________________//
// display meals Categories
function displayCategory(a) {
  closeSideNav();
  $("#contact").addClass("d-none")
  clearSearchCotainer();
  clearDefaultMeals();
  let cartoona = "";
  let splitedtext = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i].strCategoryDescription != null) {
      splitedtext = a[i].strCategoryDescription.split(" ").slice(0, 20).join(" ");
    } else {
      splitedtext = a[i].strCategoryDescription;
    }
    cartoona += `
  <div class="col-lg-3 col-md-6 col-sm-12 gy-4" >
    <div class="meal-cat rounded-2 pointer"onclick="getCategoriesDetail('${a[i].strCategory}')">
        <img src="${a[i].strCategoryThumb}" alt="">
        <div class="layer text-center">
            <h3>${a[i].strCategory}</h3>
            <p>${splitedtext}</p>
        </div>
    </div>
</div>
    `;
  }
  $("#meals").html(cartoona);
}
// get meals Categories from Api
async function getCategories() {

  fadeIn()
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let finalresponse = await response.json();
  displayCategory(finalresponse.categories);
  fadeOut();
}
// get meals of each categories from Api
async function getCategoriesDetail(cat) {
  closeSideNav();
  fadeIn()
  $("#contact").addClass("d-none")
  clearDefaultMeals();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  let finalresponse = await response.json();

  displayMeals(finalresponse.meals.slice(0, 20));
  fadeOut();
}
//___________________________Categories Meal Details(igrediants)___________________________________//

// get meal detail
async function getMealingreds(id) {
  closeSideNav();
  fadeIn();
  closeSideNav();
  $("#contact").addClass("d-none")
  clearSearchCotainer();
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let finalresponse = await respone.json();
  let meal = finalresponse.meals[0];
  console.log(meal);
  displayMealsIngred(meal);
  fadeOut();
}

// display meal detail
function displayMealsIngred(meal) {
  $("#contact").addClass("d-none")
  clearSearchCotainer();
  // loop on all ingrediants
  let ingreds = ``;
  for (let i = 0; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingreds += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]
        } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags;
  if (meal.strTags) {
    tags = meal.strTags.split(",");
  } else {
    tags = [];
  }
  // loop on all tags
  let tagsMeal = "";
  for (let i = 0; i < tags.length; i++) {
    tagsMeal += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  let cartoona = `
    <div class="col-md-4">
      <img class="w-100 rounded-3"src="${meal.strMealThumb}" alt="">
      <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
      <h3><span class=" fw-bolder">Category : </span>${meal.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex py-3 flex-wrap ">${ingreds}
      </ul>
      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex  flex-wrap py-3">
        ${tagsMeal}
      </ul>
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;

  $("#meals").html(cartoona);
}

//______________________________________________________________________//
//___________________________Meals by Area______________________________//
//______________________________________________________________________//

// display Areas
function displayAreas(a) {

  $("#contact").addClass("d-none")
  clearSearchCotainer();
  clearDefaultMeals();
  let cartoona = "";
  for (let i = 0; i < a.length; i++) {
    cartoona += `
  <div class="col-lg-3 col-md-6 col-sm-12 gy-4" >
      <div class="rounded-2 text-center pointer" onclick="getmealsyArea('${a[i].strArea}')">
       <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${a[i].strArea}</h3>
        </div>
  </div>
    `;
  }
  $("#meals").html(cartoona);
}

// get areas from Api
async function getAreas() {
  fadeIn();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let finalresponse = await response.json();
  displayAreas(finalresponse.meals);
  fadeOut();
}
// display area meals
async function getmealsyArea(area) {
    closeSideNav();
  fadeIn();
  $("#contact").addClass("d-none")
  clearDefaultMeals();
  clearSearchCotainer();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let finalresponse = await response.json();
  console.log(finalresponse.meals);
  displayMeals(finalresponse.meals.slice(0, 20));
  fadeOut();
}


//______________________________________________________________________//
//___________________________Meals by Ingrediats______________________________//
//______________________________________________________________________//

// display main ingrediants
function displayMainIngrediants(a) {

  $("#contact").addClass("d-none")
  clearDefaultMeals();
  let cartoona = "";
  let splitedtext = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i].strDescription != null) {
      splitedtext = a[i].strDescription.split(" ").slice(0, 20).join(" ");
    }
    else {
      splitedtext = a[i].strDescription;
    }
    cartoona += `
  <div class="col-lg-3 col-md-6 col-sm-12 gy-4" >
    <div class="rounded-2 text-center pointer" onclick="getingMeals('${a[i].strIngredient}')">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${a[i].strIngredient}</h3>
                         <p>${splitedtext}</p>
                </div>
  </div>
    `;

  }
  $("#meals").html(cartoona);
}
// get ingrediats from Api
async function getIngrediants() {
  fadeIn();
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  let finalresponse = await response.json();
  displayMainIngrediants(finalresponse.meals.slice(0, 20));
  fadeOut();
}

// get meals by ingrediants from Api
async function getingMeals(ing) {
      closeSideNav();
  fadeIn();
  $("#contact").addClass("d-none")
  clearDefaultMeals();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
  );
  let finalresponse = await response.json();

  displayMeals(finalresponse.meals.slice(0, 20));
  fadeOut();
}


//______________________________________________________________________//
//___________________________Contact______________________________//
//______________________________________________________________________//

// display showInputs
function showinputs() {
  
  ;
  $("#contact").removeClass("d-none")
  clearDefaultMeals();
  clearSearchCotainer();
}
//________________________Inputs-actions______________________________//
$(".inputsContainer input").on("keyup", () => {
  inputsValidation()

});

$("#nameInput").on("focus", () => {
  nameInput = true;
});

$("#emailInput").on("focus", () => {
  emailInput = true;
});
$("#phoneInput").on("focus", () => {
  phoneInput = true;
});
$("#ageInput").on("focus", () => {
  ageInput = true;
});
$("#passwordInput").on("focus", () => {
  passwordInput = true;
});
$("#repasswordInput").on("focus", () => {
  repasswordInput = true;
});
let submitBtn = document.getElementById("submitBtn");
//________________________validation______________________________//

// validatin
let nameInput = false;
let emailInput = false;
let phoneInput = false;
let ageInput = false;
let passwordInput = false;
let repasswordInput = false;

function inputsValidation() {
  if (nameInput) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInput) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInput) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInput) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInput) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInput) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}
function nameValidation() {
  let name = document.getElementById("nameInput").value;
  return /^[a-zA-Z ]+$/.test(name);
}
function emailValidation() {
  let email = document.getElementById("emailInput").value
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}
function phoneValidation() {
  let phone = document.getElementById("phoneInput").value;
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    phone
  );
}
function ageValidation() {
  let age = document.getElementById("ageInput").value;
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    age
  );
}
function passwordValidation() {
  let pass = document.getElementById("passwordInput").value;
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(pass);
}
function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}