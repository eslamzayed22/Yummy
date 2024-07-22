let rowData = document.querySelector("#rowData");
let searchContainer = document.querySelector("#searchContainer");

// loading page
$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(300)
        $("body").css("overflow", "visible")
    })
})

// sidebar
function openSideNav() {
    $(".sidebar").animate({
        left: 0
    }, 600)
    $(".open-icon").removeClass("fa-align-justify");
    $(".open-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".sidebar .nav-tab").outerWidth()
    $(".sidebar").animate({
        left: -boxWidth
    }, 600)
    $(".open-icon").addClass("fa-align-justify");
    $(".open-icon").removeClass("fa-x");
    $(".links li").animate({
        top: 300
    }, 600)
}

closeSideNav()
$(".sidebar i.open-icon").click(() => {
    if ($(".sidebar").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})
// search
search.addEventListener('click' , () => {    
    openSearch();
    closeSideNav();    
});
function openSearch() {
    searchContainer.innerHTML =`
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white mb-3" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`
    rowData.innerHTML = ""
}

async function searchByName(text) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`)
    response = await response.json()
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)
}

async function searchByFLetter(text) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    text == "" ? text = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${text}`)
    response = await response.json()
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)
}

// meals
function displayMeals(ml) {
    let box = "";
    for (let i = 0; i < ml.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${ml[i].idMeal}')" class="meal position-relative overflow-hidden cursor-pointer rounded-2">
                    <img class="w-100" src="${ml[i].strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center justify-content-center p-2 text-black">
                        <h3 class="">${ml[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    rowData.innerHTML = box
}

// categories section
categories.addEventListener('click' , () => {    
    openCategories();
    closeSideNav();    
});
async function openCategories() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    searchContainer.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    displayCategories(response.categories)
    $(".inner-loading-screen").fadeOut(300)
}

function displayCategories(ml) {
    let box = "";
    for (let i = 0; i < ml.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${ml[i].strCategory}')" class="meal position-relative overflow-hidden cursor-pointer rounded-2 ">
                    <img class="w-100" src="${ml[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center p-2 text-black">
                        <h3>${ml[i].strCategory}</h3>
                        <p>${ml[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }
    rowData.innerHTML = box
}

// Category Meals 
async function getCategoryMeals(category) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

// Meal Details 
async function getMealDetails(mealID) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    displayMealDetails(respone.meals[0])
    $(".inner-loading-screen").fadeOut(300)
}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger p-1 m-2">${tags[i]}</li>`
    }
    let box = `
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3">
                    ${ingredients}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`
    rowData.innerHTML = box
}

// area section
area.addEventListener('click' , () => {    
    openArea();
    closeSideNav();    
});
async function openArea() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);
    displayArea(respone.meals)
    $(".inner-loading-screen").fadeOut(300)
}

function displayArea(ml) {
    let box = "";
    for (let i = 0; i < ml.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${ml[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${ml[i].strArea}</h3>
                </div>
        </div>
        `
    }
    rowData.innerHTML = box
}

// Area Meals 
async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

// Ingredients section
ingredients.addEventListener('click' , () => {    
    openIngredients();
    closeSideNav();    
});
async function openIngredients() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);
    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

function displayIngredients(ml) {
    let box = "";
    for (let i = 0; i < ml.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ml[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ml[i].strIngredient}</h3>
                        <p>${ml[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }
    rowData.innerHTML = box
}

// Ingredients Meals 
async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}

// contacts
contact.addEventListener('click' ,() => {    
    openContact();
    closeSideNav();    
});
function openContact() {
    rowData.innerHTML = `<div class="contact d-flex justify-content-center align-items-center min-vh-100">
    <div class="container text-center w-75">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter same password 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn px-2 mt-3 btn-outline-danger">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouch = true
    })
    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouch = true
    })
    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouch = true
    })
    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouch = true
    })
    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouch = true
    })
    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouch = true
    })
}

let nameInputTouch = false;
let emailInputTouch = false;
let phoneInputTouch = false;
let ageInputTouch = false;
let passwordInputTouch = false;
let repasswordInputTouch = false;

// validation inputs
function nameValidate() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}
function phoneValidate() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}
function emailValidate() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}
function ageValidate() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}
function passwordValidate() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}
function repasswordValidate() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}

function inputsValidation() {
    if (nameInputTouch) {
        if (nameValidate()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")
        }
    }
    if (emailInputTouch) {
        if (emailValidate()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")
        }
    }
    if (phoneInputTouch) {
        if (phoneValidate()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
        }
    }
    if (ageInputTouch) {
        if (ageValidate()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")
        }
    }
    if (passwordInputTouch) {
        if (passwordValidate()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
        }
    }
    if (repasswordInputTouch) {
        if (repasswordValidate()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
        }
    }
    if (nameValidate() && phoneValidate() && emailValidate() && ageValidate() && passwordValidate() && repasswordValidate()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}
