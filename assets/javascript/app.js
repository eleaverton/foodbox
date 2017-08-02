var sourceURL;
var imgURL;
var title;
var rating;
var foodImg;
var foodDetails;
var searchTerm;
var calories = 0;
var protein =0;

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
    $("#btnSearch").on("click", function(event) {
    	$("#foodImgDiv").empty();
    	$("#foodDiv").empty();
    	event.preventDefault();
    	searchTerm = $("#searchInput").val();
    	var callURL1 = "https://community-food2fork.p.mashape.com/search?key=ed45a57912d5188b7b4b7280c78848ea&q=" + searchTerm;
    	var callURL2;
    	$.ajax({
        	url: callURL1,
        	method: "GET",
        	dataType: 'json',
        	error: function(err) { alert(err); },
        	beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
            // Enter here your Mashape key
        }
    	}).done(function(response) {
        	console.log(response);
        	for (i = 0; i < 12; i++) {
        		sourceURL = response.recipes[i].source_url;
        		imgURL = response.recipes[i].image_url;
        		title = response.recipes[i].title;   
        		rating = response.recipes[i].social_rank;
        		foodImg = $("<img height='200px' width='200px'>");
        		foodImg.attr("src", imgURL);
        		$("#foodImgDiv").append(foodImg);
        		foodDetails = $("<p>" + title + "</p>" + "<p>Rating: " + rating + "</p>");
        		$("#foodDetailsDiv").append(foodDetails);
        		 //url for ajax call to getting ingredients from sourceurl
    			var callURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=" + sourceURL;
    			//variable for url for second ajax call
    			var callURL2;
    			//this ajax call gets the ingredients from the website recipe
    			$.ajax({
        			url: callURL,
        			method: "GET",
        			dataType: 'json',
        			error: function(err) { alert(err); },
        			beforeSend: function(xhr) {
            		xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
        		}
    			}).done(function(response) {
        			//On response, this for loop should go throught the ingredients and return the information about them and plug the information into the next ajax call url
        			for (i = 0; i < response.extendedIngredients.length; i++) {
            			var id = response.extendedIngredients[i].id;
            			var amount = response.extendedIngredients[i].amount;
            			var unit = response.extendedIngredients[i].unit;
            			callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/"+id+"/information?amount="+amount+"&unit="+unit;
            			//this ajax call gets the nutrition information about each ingredient based on id, amount, and unit
            			$.ajax({
                		url: callURL2,
                		method: "GET",
		                dataType: 'json',
		                error: function(err) { alert(err); },
		                beforeSend: function(xhr) {
		                    xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
		                    
		                }
			            }).done(function(response){
			            	console.log(response);
			            	console.log(response.nutrition.nutrients[i].amount);
			            	//sum up calories from all ingredients into total calorie count
			            	calories += parseInt(response.nutrition.nutrients[i].amount);
			            	console.log("total calories: "+calories);
			            })
        			};
    			});
        	}
    	});
    });
});