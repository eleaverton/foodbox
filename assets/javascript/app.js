var sourceURL="http://www.closetcooking.com/2011/04/jalapeno-popper-grilled-cheese-sandwich.html";
var imgURL = "http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg";
var foodItemsiTitle="Jalepeno Popper Grilled Cheese Sandwich";
var foodItemsiRating=100;
var foodImg;
var foodDetails;
var searchTerm;
var foodItemsiCalories = "1300";
var foodItemsiFat = "18";
var foodItemsiProtein = "8";
var foodItems = [];
var newFoodItem = {};
var counter = 0;

$(document).ready(function() {
    $("#btnSearch").on("click", function(event) {
        $("#foodImgDiv").empty();
        event.preventDefault();
        searchTerm = $("#searchInput").val();


        setTimeout(display, 800);

        function display() {
            	var recipeDiv = $("<div class='tile-is-parent recipeDiv'></div>");
            	var recipeArticle = $("<article class='tile is-child'></article>");
            	var recipeFigure = $("<figure class='image is-4by3'></figure>");
            	var recipeTitle=$("<p class='title food-title'>"+foodItemsiTitle+"</p>");
            	var recipeInfo=$("<div class='content'>Calories: "+foodItemsiCalories+ "<br> Fat: "+foodItemsiFat+"<br> Protein: "+foodItemsiProtein+"</div>")

            	foodImg = $("<img height='200px' width='200px'>");
                foodImg.attr("src", imgURL);
                console.log (foodImg);
                $(recipeFigure).append(foodImg);

                // foodDetails = $("<p>" + foodItemsiTitle + "</p>" + "<p>Rating: " + foodItemsiRating +
                //     "</p>" + "<p>Total Calories: " + foodItemsiCalories + "</p>" + "<p>Total Fat: " + foodItemsiFat + "</p>" +
                //     "<p>Total Protein: " + foodItemsiProtein + "</p>");
                // $("#foodDetailsDiv").append(foodDetails);
            
            // $(recipeArticle).append(recipeFigure, recipeTitle, recipeInfo);
            // $(recipeDiv).append(recipeArticle);
            $(recipeArticle).append(recipeFigure, recipeTitle, recipeInfo);
            $(recipeDiv).append(recipeArticle);
            $(foodImgDiv).append(recipeDiv);
        }
    });
});