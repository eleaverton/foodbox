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
var foodObject = {};
var ingObjects = [];
var ingObject = {};
var foodHealthStats = [];
var foodHealthStat = {};
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
	$("#foodImgDiv").empty();
    $("#foodDetailsDiv").empty();
    event.preventDefault();
    searchTerm = $("#searchInput").val();
    

    for (i = 0; i < 1; i++) {
    	getSearchedResults(i);
    }
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
	    		for (i = 0; i < 1; i++) {
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
	        hr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
	        		}
    	}).done(function(resIng) {
       	//On response, this for loop should go throught the ingredients and return the information about them and plug the information into the next ajax call url  	
		    console.log(resIng);
		    console.log(resIng.extendedIngredients.length - 1);
		    console.log(i);
		    for (i = 0; i < resIng.extendedIngredients; i++) {
		    	ingObject.Id = resIng.extendedIngredients[i].id;
		    	ingObject.Amount = resIng.extendedIngredients[i].amount;
		    	ingObject.Unit = resIng.extendedIngredients[i].unit;  
		    	ingObjects.push(ingObject);
			}
			if (ingObjects.length === 2) {
	    		for (i = 0; i < 1; i++) {
	    			getHealthStats(i);
	    		}
	    	}
	    });
    }
	function getHealthStats(i) {
		callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/"+ingObjects[i].id+"/information?amount="+ingObjects[i].amount+"&unit="+ingObjects[i].unit; //this ajax call gets the nutrition information about each ingredient based on id, amount, and unit
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
        	calories += parseInt(resHealthStats.nutrition.nutrients[0].amount);
        	fat += parseInt(resHealthStats.nutrition.nutrients[1].amount);
        	protein += parseInt(resHealthStats.nutrition.nutrients[7].amount);
        	console.log("Total Calories: " + calories);
        	foodHealthStat.Calories = calories;	
        	foodHealthStat.Fat = fat;
        	foodHealthStat.Protein = protein;	  
        	console.log(counter);       
        	counter++;
        })         
	}
});