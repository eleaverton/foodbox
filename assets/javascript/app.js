var sourceURL="http://www.closetcooking.com/2011/04/jalapeno-popper-grilled-cheese-sandwich.html";
var imgURL = ["http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg","http://static.food2fork.com/GuacamoleGrilledCheese6019.jpg","http://static.food2fork.com/Caprese2BGrilled2BCheese2BSandwich2B5002B21616ce448f5.jpg","http://static.food2fork.com/parmesancrustedpestogrilledcheese5a41.jpg"];
var foodItemsiTitle=["Jalepeno Popper Grilled Cheese Sandwich","Guacamole Grilled Cheese Sandwich","Caprese Grilled Cheese Sandwich","Parmesean Crusted Pesto Grilled Cheese"];
var foodItemsiRating=100;
var foodImg;
var foodDetails;
var searchTerm;
var foodItemsiId = ["1145","5690","7123","1789"]
var foodItemsiCalories = ["1300","900","1000","850"];
var foodItemsiFat = ["18","10","12","15"];
var foodItemsiProtein = ["8","4","6","7"];
var foodItems = [];
var newFoodItem = {};
var counter = 0;



$(document).ready(function() {
    $("#btnSearch").on("click", function(event) {
        $(".rowTile").empty();
        event.preventDefault();
        searchTerm = $("#searchInput").val();

        setTimeout(display, 800);

        function display() {
        	for(i=0;i<4;i++){
            	var recipeDiv = $("<div class='tile-is-parent recipeDiv' id="+foodItemsiId[i]+"></div>");
            	var recipeArticle = $("<article class='tile is-child'></article>");
            	var recipeFigure = $("<figure class='image is-4by3'></figure>");
            	var recipeTitle=$("<p class='title food-title'><i class='fa fa-star-o star' id='star"+foodItemsiId[i]+"' aria-hidden='true'></i>"+foodItemsiTitle[i]+"</p>");
            	//console.log(recipeTitle);
            	var recipeInfo=$("<div class='content'>Calories: "+foodItemsiCalories[i]+ "<br> Fat: "+foodItemsiFat[i]+"<br> Protein: "+foodItemsiProtein[i]+"</div>");
            	var tileDiv="#tileDiv1";
            	//console.log("i: "+i);
            	//console.log("remainder: "+i%3);

            if (i%3===0){
            	console.log("i/3: "+i/3)
            	tileDiv = "#tileDiv"+(i/3 + 1);
            	//console.log(tileDiv)
            }	

            	foodImg = $("<img>");
                foodImg.attr("src", imgURL[i]);
                //console.log (foodImg);
                $(recipeFigure).append(foodImg);
                //need to make image link to sourceURL

                // foodDetails = $("<p>" + foodItemsiTitle + "</p>" + "<p>Rating: " + foodItemsiRating +
                //     "</p>" + "<p>Total Calories: " + foodItemsiCalories + "</p>" + "<p>Total Fat: " + foodItemsiFat + "</p>" +
                //     "<p>Total Protein: " + foodItemsiProtein + "</p>");
                // $("#foodDetailsDiv").append(foodDetails);
            
            // $(recipeArticle).append(recipeFigure, recipeTitle, recipeInfo);
            // $(recipeDiv).append(recipeArticle);
            $(recipeArticle).append(recipeFigure, recipeTitle, recipeInfo);
            $(recipeDiv).append(recipeArticle);
            $(tileDiv).append(recipeDiv);
        }
        }
    });
    $(document).on("click",".star",function(event) {
    	console.log("hi");
    	console.log(this);
    	console.log($(this).parents()[2].id);
    	var selectedRecipe = $(this).parents()[2].id;
    	console.log(selectedRecipe);
    	//next we will add firebase push command based on selected recipe
    	//matching the id of the recipe in the array

   	});

});