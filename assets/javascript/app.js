var sourceURL = ["http://www.closetcooking.com/2011/04/jalapeno-popper-grilled-cheese-sandwich.html", "http://www.google.com", "http://www.food2fork.com", "http://www.facebook.com"];
var imgURL = ["http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg", "http://static.food2fork.com/GuacamoleGrilledCheese6019.jpg", "http://static.food2fork.com/Caprese2BGrilled2BCheese2BSandwich2B5002B21616ce448f5.jpg", "http://static.food2fork.com/parmesancrustedpestogrilledcheese5a41.jpg"];
var foodItemsiTitle = ["Jalepeno Popper Grilled Cheese Sandwich", "Guacamole Grilled Cheese Sandwich", "Caprese Grilled Cheese Sandwich", "Parmesean Crusted Pesto Grilled Cheese"];
var foodItemsiRating = 100;
var foodImg;
var foodDetails;
var searchTerm;
var foodItemsiId = ["1145", "5690", "7123", "1789"]
var foodItemsiCalories = ["1300", "900", "1000", "850"];
var foodItemsiFat = ["18", "10", "12", "15"];
var foodItemsiProtein = ["8", "4", "6", "7"];
var foodItems = [];
var newFoodItem = {};
var counter = 0;
var key;
var username;

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

// Create an instance of the Google provider object
var provider = new firebase.auth.GoogleAuthProvider();
// create instance of firebase database
var usersRef = database.ref("/users");
var recipeRef;
var newUser = {};

$(document).ready(function() {
            // foodbox new user sign up
            $("#signup").on("click", function(event) {
                event.preventDefault();
                newUser.userName = $("#signUpUser").val().trim();
                newUser.recipes = 0;
                console.log(newUser.name);
                //push the newuser and get the key assciated with the data push
                pushedUserRef = usersRef.push(newUser);
                key=pushedUserRef.getKey();
                console.log(key);
                (function(global){
                    global.localStorage.setItem('keyvalue',key);
                }(window));
                
                
                username = newUser.userName;
                console.log(username);
                (function(global){
                    global.localStorage.setItem('username',username);
                }(window));

                window.open("index.html","_self")

            });

            // button to sign into foodbox app
            $("#signin").on("click", function(event) {
                event.preventDefault();
                var userInDatabase = false;
                var name = $("#signInUser").val().trim();
                usersRef.once("value", function(snap) {
                    snap.forEach(function(child) {
                        if (child.val().userName === name) {
                            window.open("index.html","_self");
                            //**open in same tab
                            // cancel enumeration
                            userInDatabase = true;
                            return true;
                            username=name;
                            console.log(username);
                            //need to be able to pull key
                        }
                    }); // end of snap eventlistener
                    // if user was not found
                    if (!userInDatabase) {
                        // alert("You are not recognized");
                        $("#signinDiv").append("Username not in database.");
                    }
                }); // end of usersRef eventlistener
            });

            $("#btnSearch").on("click", function(event) {
                (function(global){
                    key=global.localStorage.getItem("keyvalue");
                }(window));
                (function(global){
                    username=global.localStorage.getItem("username");
                }(window));
                console.log(key);
                console.log(username);
                $(".rowTile").empty();
                event.preventDefault();
                searchTerm = $("#searchInput").val();

                setTimeout(display, 800);

                function display() {
                    for (i = 0; i < 4; i++) {
                        var recipeDiv = $("<div class='tile-is-parent recipeDiv' id=" + foodItemsiId[i] + "></div>");
                        var recipeArticle = $("<article class='tile is-child'></article>");
                        var recipeFigure = $("<figure class='image is-4by3'></figure>");
                        var recipeTitle = $("<p class='title food-title'><i class='fa fa-star-o star' id='star" + foodItemsiId[i] + "' aria-hidden='true'></i>" + foodItemsiTitle[i] + "</p>");
                        //console.log(recipeTitle);
                        var recipeInfo = $("<div class='content'>Calories: " + foodItemsiCalories[i] + "<br> Fat: " + foodItemsiFat[i] + "<br> Protein: " + foodItemsiProtein[i] + "</div>");
                        var tileDiv = "#tileDiv1";
                        //console.log("i: "+i);
                        //console.log("remainder: "+i%3);

                        if (i % 3 === 0) {
                            console.log("i/3: " + i / 3)
                            tileDiv = "#tileDiv" + (i / 3 + 1);
                            //console.log(tileDiv)
                        }

                        foodImg = $("<img>");
                        foodImg.attr("src", imgURL[i]);
                        //console.log (foodImg);
                        $(recipeFigure).append(foodImg);
                        //need to make image link to sourceURL


                        $(recipeArticle).append(recipeFigure, recipeTitle, recipeInfo);
                        $(recipeDiv).append(recipeArticle);
                        $(tileDiv).append(recipeDiv);
                    }
                }
            });
            $(document).on("click", ".star", function(event) {
                console.log($(this).parents()[2].id);
                var selectedRecipeId = $(this).parents()[2].id;
                console.log(selectedRecipeId);
                var starId = "#star"+selectedRecipeId;
                console.log(starId);
                 $(starId).removeClass('fa-star-o').addClass('fa-star');
                //find recipeid in array of info from ajax calls
                var position = foodItemsiId.indexOf(selectedRecipeId);
                console.log(position);
                var selectedRecipe = {};
                selectedRecipe.Id = selectedRecipeId;
                selectedRecipe.Title = foodItemsiTitle[position];
                selectedRecipe.imgURL = imgURL[position];
                selectedRecipe.sourceURL = sourceURL[position];

                console.log(selectedRecipe);
                console.log(key);
                recipeRef = database.ref("/users/"+key+"/recipes")
                recipeRef.push(selectedRecipe);

//https://console.firebase.google.com/project/foodbox-aac5f/database/data/users/-KqoinL1Idirj6XD8coX/recipes
                // usersRef.on("value", function(snap) {
                //     snap.forEach(function(child) {
                //         if (child.val().userName === username) {
                //             var key = child.key;
                //             console.log(key);
                //             // generate a key for a selected recipe
                //             var userRecipesRef = usersRef.push().key;
                //             console.log(userRecipesRef + "/" + key);
                //             var updates = {};

                //             updates['/users/' + key + "/" + userRecipesRef] = selectedRecipe;
                //             firebase.database().ref().update(updates);
                            
            
                            
                //             return true;
                //         }
                //     }); // end of snap eventlistener
                //     });
                    //next we will add firebase push command based on selected recipe
                    //matching the id of the recipe in the array

                });

            });

