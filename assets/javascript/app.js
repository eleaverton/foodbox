var sourceURL;
var imgURL;
var title;
var rating;
var foodImg;
var foodDetails;
var searchTerm;
var calories = 0;
var fat = 0;
var protein = 0;
var foodObjects = [];
var allIngObjects = [];
var foodHealthStats = [];
var counter = 0;

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

$(document).ready(function() {
    $("#btnSearch").on("click", function() {
        $("#foodImgDiv").empty();
        $("#foodDetailsDiv").empty();
        event.preventDefault();
        searchTerm = $("#searchInput").val();
        for (i = 0; i < 2; i++) {
            getSearchedResults(i);
        }
    });
	function getSearchedResults(i) {
   		var callURL = "https://community-food2fork.p.mashape.com/search?key=ed45a57912d5188b7b4b7280c78848ea&q=" + searchTerm;
   		$.ajax({
    		url: callURL,
    		method: "GET",
    		dataType: 'json',
    		error: function(err) { alert(err); },
    		beforeSend: function(xhr) {
        	xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
            // Enter here your Mashape key
        }
    	}).done(function(resRecipe) {
        	console.log(resRecipe);
            var foodObject = {};
        	sourceURL = resRecipe.recipes[i].source_url;
        	imgURL = resRecipe.recipes[i].image_url;
        	title = resRecipe.recipes[i].title;   
        	rating = resRecipe.recipes[i].social_rank;
	    	foodObject.SourceURL = sourceURL;
	    	foodObject.ImgURL = imgURL;
	    	foodObject.Title = title;
	    	foodObject.Rating = rating;
	    	foodObjects.push(foodObject);
	    	if (foodObjects.length === 2) {
	    		for (i = 0; i < 2; i++) {
	    			getSearchedIng(i);
	    		}
	    	}
	      });
    }
    function getSearchedIng(i) {
    	var callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=" + foodObjects[i].SourceURL;
    	$.ajax({
	       	url: callURL2,
	        method: "GET",
	        dataType: 'json',
	        beforeSend: function(xhr) {
	        xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
	        		}
    	}).done(function(resIng) {
       	//On response, this for loop should go throught the ingredients and return the information about them and plug the information into the next ajax call url  	
		    console.log(resIng);
		    console.log(resIng.extendedIngredients.length - 1);
		    console.log(i);
            var ingObjects = [];
		    for (i = 0; i < resIng.extendedIngredients.length; i++) {
                var ingObject = {};
                var id = resIng.extendedIngredients[i].id;
                var amount = resIng.extendedIngredients[i].amount;
                var unit = resIng.extendedIngredients[i].unit;  
		    	ingObject.Id = id;
		    	ingObject.Amount = amount;
		    	ingObject.Unit = unit;
                ingObjects.push(ingObject);
			}
            allIngObjects.push(ingObjects);
			if (allIngObjects.length === 2) {
	    		for (i = 0; i < 2; i++) {
                    for (j = 0; j < allIngObjects[i].length - 1; j++) {
                        getHealthStats(i,j);
                    }    	
	    		}
	    	}         
	    });
    }
	function getHealthStats(i,j) {
        var ingId = allIngObjects[i][j].Id;
        var ingAmount = allIngObjects[i][j].Amount;
        var ingUnit = allIngObjects[i][j].Unit;
		callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/"+ingId+"/information?amount="+ingAmount+"&unit="+ingUnit; //this ajax call gets the nutrition information about each ingredient based on id, amount, and unit
		$.ajax({
		url: callURL2,
		method: "GET",
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
            
        }
        }).done(function(resHealthStats) {
        	//sum up calories from all ingredients into total calorie count
        	console.log(resHealthStats);
            for (i = 0; i < allIngObjects[counter].length; i++) {
                var foodHealthStat = {};
                calories += parseInt(resHealthStats.nutrition.nutrients[0].amount);
                fat += parseInt(resHealthStats.nutrition.nutrients[1].amount);
                protein += parseInt(resHealthStats.nutrition.nutrients[7].amount);
                console.log("Total Calories: " + calories);
                foodHealthStat.Calories = calories; 
                foodHealthStat.Fat = fat;
                foodHealthStat.Protein = protein;               
                counter++;
                if (counter === allIngObjects.length) {
                    counter = 0;
                    foodHealthStats.push(foodHealthStat);
                    calories = 0;
                    fat = 0;
                    protein = 0; 
                }
            } 
            console.log(foodHealthStat);  
        })         
	}
});