//global variables defined
var sourceURL;
var imgURL;
var title;
var rating;
var foodImg;
var foodDetails;
var searchTerm;
var recipeResult;
var recipeId
//need to make sure this pulls from spoonacular
var calories = 0;
var caloriesSum = 0;
var fat = 0;
var fatSum = 0;
var protein = 0;
var proteinSum = 0;
var servings;
var foodObjects = []; //is this the same as foodItems
var foodHealthStats = [];
var foodIngObjects = [];
var counter = 0;
var counter2 = 0;
var recipeArticle;
var key;
var username;
var savedRecipeInfo = [];
var myfoodbox = [];
var newUser = {};
//firebase setup and associated variables
var config = {
    apiKey: "AIzaSyBHqANba4Adm1lWbJn3H9UGNVBZ4ZvIf00",
    authDomain: "foodbox-aac5f.firebaseapp.com",
    databaseURL: "https://foodbox-aac5f.firebaseio.com",
    projectId: "foodbox-aac5f",
    storageBucket: "foodbox-aac5f.appspot.com",
    messagingSenderId: "445978114128"
};
firebase.initializeApp(config);
var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();
//LL^^do we need this?
var usersRef = database.ref("/users");
var recipeRef;
var mashapekey = "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX";

//define functions
function getSearchedResults() {
    var callURL = "https://community-food2fork.p.mashape.com/search?key=ed45a57912d5188b7b4b7280c78848ea&q=" + searchTerm;
    return $.ajax({
        url: callURL,
        method: "GET",
        dataType: 'json',
        error: function(err) { alert(err); },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", mashapekey);
            // Enter here your Mashape key
        }
    }).done(function(resRecipe){
    	console.log(resRecipe);
    });
}

function getFoodObjects(resRecipe) {
	//get updates after manual merge
    for (var i = 0; i < 6; i++) {
        var foodObject = {};
        sourceURL = resRecipe.recipes[i].source_url;
        imgURL = resRecipe.recipes[i].image_url;
        title = resRecipe.recipes[i].title;
        rating = resRecipe.recipes[i].social_rank;
        recipeId = resRecipe.recipes[i].recipe_id;
        console.log(recipeId);
        foodObject.SourceURL = sourceURL;
        foodObject.ImgURL = imgURL;
        foodObject.Title = title;
        console.log(foodObject.Title);
        foodObject.Rating = rating;
        foodObject.RecipeId = recipeId;
        foodObjects.push(foodObject);
        console.log(foodObjects[i].Title);
        // display on page

        var recipeDiv = $("<div class='tile is-parent recipeDiv' id="+foodObjects[i].RecipeId+"></div>");
        recipeArticle = $("<article class='tile is-child'></article>");
        var recipeFigure = $("<figure class='image is-4by3'></figure>");
        var recipeTitle = $("<p class='title food-title'><i class='fa fa-star-o star' id='star" + foodObjects[i].RecipeId + "' aria-hidden='true'></i>" + foodObjects[i].Title + "</p>");
        console.log(recipeTitle);
        var tileDiv = "#tileDiv1";

        if (i>2) {
            tileDiv = "#tileDiv2"
            console.log(tileDiv)
        }

        foodImg = $("<img>");
        foodImg.attr("src", foodObjects[i].ImgURL);
        foodImg.attr("source",foodObjects[i].SourceURL);
        foodImg.addClass("foodImage");
        var str = title;
        str = str.replace(/\s/g, '');
        foodImg.attr("title", str);
        $(recipeFigure).append(foodImg);
        //**need to make title link to sourceURL
        $(recipeArticle).append(recipeFigure, recipeTitle);
        $(recipeDiv).append(recipeArticle);
        $(tileDiv).append(recipeDiv);
        

    }
}

//get ingrediesnts of recipes in search results
function getSearchedIng(foodURL) {
    var callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=" + foodURL;
    return $.ajax({
        url: callURL2,
        method: "GET",
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
        }
    }).done(function(resIng){
	console.log(resIng);
});
};

// get list of ingredient objects for the selected food item
function getIngredients(resIng) {
    console.log(resIng);
    //console.log(i);
    foodIngObjects = [];
    for (i = 0; i < resIng.extendedIngredients.length; i++) {
        var ingObject = {};
        var id = resIng.extendedIngredients[i].id;
        var amount = resIng.extendedIngredients[i].amount;
        var unit = resIng.extendedIngredients[i].unit;
        servings = resIng.servings;
        ingObject.Id = id;
        ingObject.Amount = amount;
        ingObject.Unit = unit;
        foodIngObjects.push(ingObject);
    }
}

// loops through list of ingredient objects and makes api call for each one
function getfoodStats() {
    // reset calories sum for selected food item
    caloriesSum = 0;
    console.log("get foodStats "+caloriesSum);
    fatSum = 0;
    proteinSum = 0;
    counter = 0;
    for (var i = 0; i < foodIngObjects.length; i++) {
        getHealthStats(foodIngObjects[i], foodIngObjects[i].Id, foodIngObjects[i].Amount, foodIngObjects[i].Unit);
    }
}
// makes ajax call for a single ingredient object
function getHealthStats(ingObject, id, amount, unit) {
    //
    callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/" +
        id + "/information?amount=" + amount + "&unit=" + unit; //this ajax call gets the nutrition information about each ingredient based on id, amount, and unit
    $.ajax({
        url: callURL2,
        method: "GET",
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");

        }
    }).then(function(resHealthStats) {
        //sum up calories from all ingredients into total calorie count
        //console.log(resHealthStats);
        calories = parseInt(resHealthStats.nutrition.nutrients[0].amount);
        fat = parseInt(resHealthStats.nutrition.nutrients[1].amount);
        protein = parseInt(resHealthStats.nutrition.nutrients[7].amount);
        ingObject.Calories = calories;
        ingObject.Fat = fat;
        ingObject.Protein = protein;
        // sum calories
        caloriesSum += calories;
        console.log("get healthStats "+caloriesSum);
        fatSum += fat;
        proteinSum += protein;
        counter++;
        if (counter === foodIngObjects.length) {
            var foodStats = $("<p id='healthInfo'>");
            foodStats.attr("class", "foodStats");
            foodStats.append("Calories: " + (caloriesSum));
            foodStats.append("<br>Fat: " + (fatSum));
            foodStats.append("<br>Protein: " + (proteinSum));
            $("#"+foodDivIndentifier).append(foodStats);
        }

    }); // end of then method

}

// display calories sum
function showCalories() {
    console.log(caloriesSum);
}

function displayFavorites() {

    $("#blankDiv").empty();

    for (i = 0; i < myfoodbox.length; i++) {

        var favoriteDiv = $("<div class='tile is-parent favorite-div'></div>");
        var favoriteArticle = $("<article class='tile is-child favorite-article'></article>");
        var favoriteFigure = $("<figure class='image is-4by3 favorite-figure'></figure>");

        var favoriteImage = $("<img>");
        favoriteImage.attr("src", myfoodbox[i].imgURL);
        favoriteImage.addClass("favorite-image");

        var favoriteLink = $("<a>");
        favoriteLink.attr("href", myfoodbox[i].sourceURL);
        $(favoriteLink).append(favoriteImage);
        console.log(favoriteLink);

        var favoriteTitle = $("<p class='favorite-title'>" + myfoodbox[i].Title + "</p>");

        $(favoriteFigure).append(favoriteLink);
        $(favoriteArticle).append(favoriteFigure, favoriteTitle);
        $(favoriteDiv).append(favoriteArticle);
        console.log(favoriteDiv);


        if (i % 2 === 0) {
            var favoritePanel = $("<div class='panel-block'></div>");
            favoritePanel.attr("id", "favoritePanel" + (i / 2 + 1));
            console.log("panel created");
        }
        console.log(favoritePanel);

        $(favoritePanel).append(favoriteDiv);

        if (i % 2 === 0) {
            $("#blankDiv").append(favoritePanel);
        }

    }; //closes for-loop

}; //closes displayFavorites function

$(document).ready(function() {
    //for index page if username exists, populate myfoodbox
    // foodbox new user sign up
    $("#signup").on("click", function(event) {
        event.preventDefault();
        //**add in if statement to check and see if username is taken
        newUser.userName = $("#signUpUser").val().trim();
        newUser.recipes = 0;
        console.log(newUser.userName);

        //push the newuser and get the key assciated with the data push
        pushedUserRef = usersRef.push(newUser);
        key = pushedUserRef.getKey();
        console.log(key);
        (function(global) {
            global.localStorage.setItem('keyvalue', key);
        }(window));


        username = newUser.userName;
        console.log(username);
        (function(global) {
            global.localStorage.setItem('username', username);
        }(window));

        window.open("index.html", "_self")
    }); //end sign-up click event
    // button to sign into foodbox app
    $("#signin").on("click", function(event) {
        event.preventDefault();
        username = "";
        console.log(username);
        var userInDatabase = false;
        var name = $("#signInUser").val().trim();
        usersRef.once("value", function(snap) {
            snap.forEach(function(child) {
                if (child.val().userName === name) {
                    window.open("index.html", "_self");
                    userInDatabase = true;
                    console.log("user identified");
                    console.log(name);
                    username = name;
                    console.log(username);
                    (function(global) {
                        global.localStorage.setItem('username', username);
                    }(window));
                }
                usersRef.orderByChild('userName').equalTo(username).on("value", function(snapshot) {
                    console.log(snapshot.val());
                    snapshot.forEach(function(data) {
                        console.log(data.key);
                        (function(global) {
                            global.localStorage.setItem('keyvalue', key);
                        }(window));
                    });
                });

            }); // end of snap eventlistener
            // if user was not found
            if (!userInDatabase) {
                // alert("You are not recognized"); not supposed to use alerts
                $("#signinDiv").append("Username not in database. Please sign up.");
            }
        }); // end of usersRef eventlistener
    }); //end sign-in click event

    $("#btnSearch").on("click", function(event) {
    	//**need to make sure search term refreshes
        (function(global) {
            key = global.localStorage.getItem("keyvalue");
        }(window));
        (function(global) {
            username = global.localStorage.getItem("username");
        }(window));
        searchTerm="";
        foodObjects=[];
        console.log(key);
        console.log(username);
        $(".rowTile").empty();
        $(".food-title").empty();
        $(".foodImage").empty();
        event.preventDefault();
        searchTerm = $("#searchInput").val();
        console.log(searchTerm);
        getSearchedResults().then(getFoodObjects);

        //on click, get health info
        $(document).on("click", ".foodImage", function(){
        	console.log("food objects: "+foodObjects);
        	console.log("food ing objects: "+foodIngObjects);
        	console.log("food health stats: "+foodHealthStats);
          $("#healthInfo").remove();
          // get food source url
          var foodURL = ($(this)[0].attributes[1].nodeValue);
          console.log($(this));
          console.log($(this)[0].attributes[1].nodeValue);
          console.log(foodURL);
  			
  			foodDivIndentifier=($(this).parent().parent().parent().attr("id"));
          // foodDivIndentifier = $(this).attr("title");
          console.log(foodDivIndentifier);
          $(this).attr("id",foodDivIndentifier);
          
          getSearchedIng(foodURL).then(getIngredients).then(getfoodStats).then(showCalories);
        });//closes on click foodImage
    });//closes on click btnSearch
    $(document).on("click", ".star", function(event) {
        console.log($(this));
        console.log($(this).parents()[2].id);
        var selectedRecipeId = $(this).parents()[2].id;
        console.log(selectedRecipeId);
        var starId = "#star" + selectedRecipeId;
        console.log(starId);
        $(starId).removeClass('fa-star-o').addClass('fa-star');
        //find recipeid in array of info from ajax calls
        var selectedRecipe = {};
        for(i=0;i<foodObjects.length;i++){
        	if (foodObjects[i].RecipeId===selectedRecipeId){
        		selectedRecipe.Id = selectedRecipeId;
        		selectedRecipe.Title = foodObjects[i].Title;
        		selectedRecipe.imgURL = foodObjects[i].ImgURL;
        		selectedRecipe.sourceURL = foodObjects[i].SourceURL;
        	}
        };
        console.log(selectedRecipe);
        console.log(key);
        recipeRef = database.ref("/users/" + key + "/recipes")
        recipeRef.push(selectedRecipe);

        recipeRef.on("child_added", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if (savedRecipeInfo.includes(childData) === false) {
                    savedRecipeInfo.push(childData);
                }
            });
        })
        console.log(savedRecipeInfo);
        var foodboxItems = myfoodbox.length;
        for (i = foodboxItems * 4; i < savedRecipeInfo.length; i++) {
            if (i % 4 === 0) {
                var foodboxrecipe = {};
                foodboxrecipe.Id = savedRecipeInfo[i];
            }
            if (i % 4 === 1) {
                foodboxrecipe.Title = savedRecipeInfo[i];
            }
            if (i % 4 === 2) {
                foodboxrecipe.imgURL = savedRecipeInfo[i];
            }
            if (i % 4 === 3) {
                foodboxrecipe.sourceURL = savedRecipeInfo[i];
                myfoodbox.push(foodboxrecipe);
                console.log(foodboxrecipe)
            }
        };
        console.log(myfoodbox);
        displayFavorites();
    }); //closes on star click

}); //closes document.ready