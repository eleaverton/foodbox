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
var foodItems = [];
var newFoodItem = {};
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
    $("#btnSearch").on("click", function(event) {
    	$("#foodImgDiv").empty();
    	$("#foodDetailsDiv").empty();
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
        	for (i = 0; i < 1; i++) {
        		sourceURL = response.recipes[i].source_url;
        		imgURL = response.recipes[i].image_url;
        		title = response.recipes[i].title;   
        		rating = response.recipes[i].social_rank;
        		newFoodItem.SourceURL = sourceURL;
        		newFoodItem.ImgURL = imgURL;
        		newFoodItem.Title = title;
        		newFoodItem.Rating = rating;
        		 //url for ajax call to getting ingredients from sourceurl
    			var callURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?forceExtraction=false&url=" + sourceURL;
    			//variable for url for second ajax call
    			var callURL2;
    			//this ajax call gets the ingredients from the website recipe
    			$.ajax({
        			url: callURL,
        			method: "GET",
        			dataType: 'json',
        			beforeSend: function(xhr) {
            		xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
        		}
    			}).done(function(response2) {
        			//On response, this for loop should go throught the ingredients and return the information about them and plug the information into the next ajax call url    		
        			for (i = 0; i < response2.extendedIngredients.length; i++) {		console.log(response2);
        				console.log(response2.extendedIngredients.length - 1);
        				console.log(i);
            			var id = response2.extendedIngredients[i].id;
            			var amount = response2.extendedIngredients[i].amount;
            			var unit = response2.extendedIngredients[i].unit;    		 
            			callURL2 = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/"+id+"/information?amount="+amount+"&unit="+unit; //this ajax call gets the nutrition information about each ingredient based on id, amount, and unit
            			$.ajax({
                		url: callURL2,
                		method: "GET",
		                dataType: 'json',
		                beforeSend: function(xhr) {
		                    xhr.setRequestHeader("X-Mashape-Authorization", "qOedqxei0amshubmBCH4ilm2lfLnp1KpP0Djsnt8Nw2LEkkbxX");
		                    
		                }
			            }).done(function(response3) {
			            	//sum up calories from all ingredients into total calorie count
			            	console.log(response3);
			            	calories += parseInt(response3.nutrition.nutrients[0].amount);
			            	fat += parseInt(response3.nutrition.nutrients[1].amount);
			            	protein += parseInt(response3.nutrition.nutrients[7].amount);
			            	console.log("Total Calories: "+ calories);
			            	newFoodItem.Calories = calories;	
			            	newFoodItem.Fat = fat;
			            	newFoodItem.Protein = protein;	         
			            	if (counter === (response2.extendedIngredients.length - 1)) {
			            		calories = 0;
			        			fat = 0;
			        			protein = 0;	
			            		foodItems.push(newFoodItem);		        
			            	}
			            	counter++;
			            })
			            
        			}     			        		      
			        $("#searchInput").val('');
			        console.log(foodItems);
    			});
    			setTimeout(display, 800);
    			function display() {
    				for (i = 0; i < foodItems.length; i++) {
    					foodImg = $("<img height='200px' width='200px'>");
        				foodImg.attr("src", imgURL);
        				$("#foodImgDiv").append(foodImg);
        				foodDetails = $("<p>" + foodItems[i].Title + "</p>" + "<p>Rating: " + foodItems[i].Rating + 
        				"</p>" + "<p>Total Calories: "+ foodItems[i].Calories + "</p>" + "<p>Total Fat: "+ foodItems[i].Fat + "</p>" + 
        				"<p>Total Protein: "+ foodItems[i].Protein + "</p>");
        				$("#foodDetailsDiv").append(foodDetails);   
    				}    				
    			}
        	}
    	});
    });
});