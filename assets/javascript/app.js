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
var savedRecipeInfo=[];
var myfoodbox=[];
var newUser = {};

$(document).ready(function() {
            // foodbox new user sign up
            $("#signup").on("click", function(event) {
                event.preventDefault();
                //**add in if statement to check and see if username is taken
                newUser.userName = $("#signUpUser").val().trim();
                newUser.recipes = 0;
                console.log(newUser.userName);
                
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

            }); //end sign-up click event

            // button to sign into foodbox app
            $("#signin").on("click", function(event) {
                event.preventDefault();
                var userInDatabase = false;
                var name = $("#signInUser").val().trim();
                usersRef.once("value", function(snap) {
                    snap.forEach(function(child) {
                        if (child.val().userName === name) {
                            window.open("index.html","_self");
                            // cancel enumeration
                            userInDatabase = true;
                            return true;
                            username=name;
                            console.log(username);
                            (function(global){
                                global.localStorage.setItem('username',username);
                            }(window));
                            //**need to be able to get to saved recipes via username
                        }
                    }); // end of snap eventlistener
                    // if user was not found
                    if (!userInDatabase) {
                        // alert("You are not recognized"); not supposed to use alerts
                        $("#signinDiv").append("Username not in database. Please sign up.");
                    }
                }); // end of usersRef eventlistener
            }); //end sign-in click event

            $("#btnSearch").on("click", function(event) {
                (function(global){
                    key=global.localStorage.getItem("keyvalue");
                }(window));
                (function(global){
                    username=global.localStorage.getItem("username");
                }(window)) ;
                console.log(key);
                console.log(username);
                $(".rowTile").empty();
                event.preventDefault();
                searchTerm = $("#searchInput").val();

                setTimeout(display, 800);

                function display() {
                    for (i = 0; i < 4; i++) {
                        //**these variable names need to be replaced with variables that match korwynns page
                        var recipeDiv = $("<div class='tile-is-parent recipeDiv' id=" + foodItemsiId[i] + "></div>");
                        var recipeArticle = $("<article class='tile is-child'></article>");
                        var recipeFigure = $("<figure class='image is-4by3'></figure>");
                        var recipeTitle = $("<p class='title food-title'><i class='fa fa-star-o star' id='star" + foodItemsiId[i] + "' aria-hidden='true'></i>" + foodItemsiTitle[i] + "</p>");
                        console.log(recipeTitle);
                        var recipeInfo = $("<div class='content'>Calories: " + foodItemsiCalories[i] + "<br> Fat: " + foodItemsiFat[i] + "<br> Protein: " + foodItemsiProtein[i] + "</div>");
                        var tileDiv = "#tileDiv1";
                        console.log("i: "+i);
                        console.log("remainder: "+i%3);

                        if (i % 3 === 0) {
                            console.log("i/3: " + i / 3)
                            tileDiv = "#tileDiv" + (i / 3 + 1);
                            console.log(tileDiv)
                        }

                        foodImg = $("<img>");
                        foodImg.attr("src", imgURL[i]);
                        //console.log (foodImg);
                        $(recipeFigure).append(foodImg);
                        //**need to make image link to sourceURL


                        $(recipeArticle).append(recipeFigure, recipeTitle, recipeInfo);
                        $(recipeDiv).append(recipeArticle);
                        $(tileDiv).append(recipeDiv);
                    } //closes for loop
                } //closes display function
            }); //closes search button click event

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

                recipeRef.on("child_added",function(snapshot){
                    snapshot.forEach(function(childSnapshot){
                        var childData=childSnapshot.val();
                        if(savedRecipeInfo.includes(childData)===false){
                            savedRecipeInfo.push(childData);
                        }
                    });
                })
                console.log(savedRecipeInfo);
                //this for loop goes through saved recipe info and creates objects for each recipe
                //it has to start in savedRecipeInfo at the point where it can skip
                //the info that has already been added as an object (hence the i=foodboxItems*4)
                var foodboxItems = myfoodbox.length;
                for (i=foodboxItems*4;i<savedRecipeInfo.length;i++){
                    if (i%4===0){
                        var foodboxrecipe={};
                        foodboxrecipe.Id= savedRecipeInfo[i];   
                    }
                    if (i%4===1){
                        foodboxrecipe.Title = savedRecipeInfo[i];
                    }
                    if (i%4===2){
                        foodboxrecipe.imgURL = savedRecipeInfo[i];
                    }
                    if (i%4===3){
                        foodboxrecipe.sourceURL = savedRecipeInfo[i];
                        myfoodbox.push(foodboxrecipe);
                        console.log(foodboxrecipe)
                    }
                };
                console.log(myfoodbox);
                
                // loop that pushes myfoodbox objects to html
                function displayFavorites (){

                $("#blankDiv").empty();

                for (i = 0; i < myfoodbox.length; i++){
                    
                    var favoriteDiv = $("<div class='tile is-parent favorite-div'></div>");
                    var favoriteArticle = $("<article class='tile is-child favorite-article'></article>");
                    var favoriteFigure = $("<figure class='image is-4by3 favorite-figure'></figure>");

                    var favoriteImage = $("<img>");
                    favoriteImage.attr("src", myfoodbox[i].imgURL);
                    
                    var favoriteLink = $("<a>");
                    favoriteLink.attr("href", myfoodbox[i].sourceURL);
                    $(favoriteLink).append(favoriteImage);
                    console.log(favoriteLink);
                    
                    var favoriteTitle = $("<p class='favorite-title'>"+ myfoodbox[i].Title + "</p>");

                    $(favoriteFigure).append(favoriteLink);
                    $(favoriteArticle).append(favoriteFigure, favoriteTitle);
                    $(favoriteDiv).append(favoriteArticle);
                    console.log(favoriteDiv);


                    if (i%2===0){
                        var favoritePanel = $("<div class='panel-block'></div>");
                        favoritePanel.attr("id", "favoritePanel" + (i/2 + 1));
                        console.log("panel created");
                    }
                    console.log(favoritePanel);

                    $(favoritePanel).append(favoriteDiv);

                    if (i%2===0){
                        $("#blankDiv").append(favoritePanel);
                    }

                    }; //closes for-loop

                };//closes displayFavorites function
                displayFavorites();

                });

            });

