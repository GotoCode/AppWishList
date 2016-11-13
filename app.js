

// array to store entries in wish list

//var numCalls = 0;

var wishList = [];


function updateItemStatus(items, index, targetNode, oldPrice, data)  // dummy code
{
	//numCalls++;

	//var oldPrice = oldPrice == "Free" ? 0 : parseInt(/.(\d+\.\d+)/.exec(oldPrice)[1]);

	//console.log(numCalls);
	//console.log(targetNode);

	var prevPrice = oldPrice;

	var formattedPrice = data.results[0].formattedPrice;
	var nextPrice = prevPrice;

	// replace the ternary operator with if-else statements

	if (oldPrice === "Free")
	{
		prevPrice = 0;
	}
	else
	{
		prevPrice = Number(/.(\d+\.\d+)/.exec(oldPrice)[1]);
	}

	// DO NOT use the ternary operator

	if (formattedPrice == "Free")
	{
		nextPrice = 0;
	}
	else
	{
		nextPrice = Number(/.(\d+\.\d+)/.exec(formattedPrice)[1]);
	}

	var redItemColor   = "list-group-item-danger";
	var greenItemColor = "list-group-item-success";

	if (nextPrice < prevPrice)
	{
		// color the list item for this app GREEN

		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);

		if (!targetNode.classList.contains(greenItemColor))
			targetNode.classList.add(greenItemColor);
	}
	else if (nextPrice > prevPrice)
	{
		// color the list item for this app RED

		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		if (!targetNode.classList.contains(redItemColor))
			targetNode.classList.add(redItemColor);
	}
	else
	{
		// set color to NEUTRAL for this list-item
		
		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);

		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		//targetNode.classList.add(greenItemColor); // dummy code
	}

	// update the price for the given app

	items[index].oldPrice = items[index].newPrice;
	items[index].newPrice = formattedPrice;

	//console.log("new oldPrice:", items[index].oldPrice);
	//console.log("new newPrice:", items[index].newPrice);
}


function populateList()
{
	var storage = window.localStorage;

	for (var i = 0; i < storage.length; i++)
	{
		wishList.push(JSON.parse(storage["item-" + i]));
	}
}


function addWishListItem(event)
{
	//console.log(event.data); // dummy code

	if (hasLocalStorage())
	{
		var storage = window.localStorage;

		storage["item-" + wishList.length] = JSON.stringify(event.data);
	}

	//console.log(event.data); // dummy code

	wishList.push(event.data);

	event.preventDefault(); // dummy code

	//console.log(window.localStorage); // dummy code
}


function deleteWishListItem(event)
{
	// determine which list item needs to be removed
	var index = parseInt(/item-(\d+)/.exec(event.currentTarget.getAttribute("id"))[1]);

	//console.log(index); // dummy code

	console.log(event.currentTarget.getAttribute("id")) // dummy code
	console.log(wishList.splice(index, 1)); // dummy code

	if (hasLocalStorage())
	{
		var storage = window.localStorage;

		storage.removeItem("item-" + index);

		// adjust indices for all other items in localStorage...

		if (wishList.length > 0)
		{
			for (var i = index + 1; ; i++)
			{
				var storageItem = storage["item-" + i];

				if (!storageItem) break;

				storage.removeItem("item-" + i);
				storage["item-" + (i - 1)] = storageItem;
			}

			/*for (var i = index + 1; ; i++)
			{
				//document.getElementById("item-" + i).setAttribute("id", "item-" + (i - 1));
				console.log(document.getElementById("item-" + i)) // dummy code
			}*/
		}
		
		document.getElementById("list-results").innerHTML = "";

		displayList(wishList);

		event.preventDefault();

		//console.log(wishList); // dummy code
	}

	//event.currentTarget.parentNode.innerHTML = ""; // dummy code

	// remove this list item from the UI
	//event.currentTarget.outerHTML = ""

	//document.getElementById("item" + index).outerHTML = "";
}


function displayList(items)
{
	var wishList = items;
	var j = 0;

	var oldPrice     = 0;
	var updatedPrice = 0;

	for (var i = 0; i < items.length; i++)
	{
		j = i;

		var imgNode = document.createElement("img");

		imgNode.setAttribute("src", items[i].icon);
		imgNode.setAttribute("class", "app-icon");

		//console.log(items[i].icon); // dummy code

		var aNode = document.createElement("a");
		
		aNode.setAttribute("href", "#");
		aNode.setAttribute("id", "item-" + i);
		aNode.setAttribute("class", "list-group-item");

		//aNode.setAttribute("role", "button"); // dummy code

		aNode.innerText = items[i].name + " - " + items[i].publisher;


		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");

		//console.log(items[i].newPrice); // dummy code

		newPrice = items[i].newPrice; // dummy code

		badgeNode.innerText = items[i].newPrice; // uncomment this when ready...

		aNode.appendChild(badgeNode);

		aNode.addEventListener("click", deleteWishListItem);

		var iTunesUrl = "https://itunes.apple.com/search";
		var queryData = {term : items[i].name, country : "US", limit : "10", entity : "software"};

		//console.log(wishList[j].name, wishList[j].newPrice); // dummy code

		// retrieve search results from iTunes server
		$.getJSON(iTunesUrl, queryData, updateItemStatus.bind(null, items, i, aNode, newPrice));

		$("#list-results").append(aNode);
		
		$("#list-results #item-" + i).prepend(imgNode);
	}
}


function showWishList()
{

	document.getElementById("list-results").innerHTML = "";

	$("#search-view").slideUp();
	$("#list-view").slideDown();

	$("#search-menu-button").removeClass("active");
	$("#list-menu-button").addClass("active");

	displayList(wishList);
}


function showSearchList()
{
	document.getElementById("list-results").innerHTML = "";

	$("#list-view").slideUp();
	$("#search-view").slideDown();

	$("#list-menu-button").removeClass("active");
	$("#search-menu-button").addClass("active");
}


function searchAppStore()
{
	// reset the list of search results
	$("a.list-group-item").replaceWith("");

	// show the loading symbol
	$("#loading-symbol").removeClass("symbol-hide");

	// base url of iTunes server
	var iTunesUrl = "https://itunes.apple.com/search";

	// retrieve data from search field
	var searchText = $("#search-field").val();

	var queryData = {term : searchText, country : "US", limit : "10", entity : "software"};

	// retrieve search results from iTunes server
	$.getJSON(iTunesUrl, queryData, function(data) {

		console.log(data); // dummy code

		var results = data.results;

		displayResults(results);

	});
}


function displayResults(results)
{
	// hide the loading symbol
	$("#loading-symbol").addClass("symbol-hide");

	// display search results on the page
	for (var i = 0; i < results.length; i++)
	{
		//var listNode = document.createElement("li");

		var imgNode = document.createElement("img");

		imgNode.setAttribute("src", results[i].artworkUrl60);
		imgNode.setAttribute("class", "app-icon");

		var aNode = document.createElement("a");
		
		aNode.setAttribute("href", "#");
		aNode.setAttribute("id", "item-" + i);
		aNode.setAttribute("class", "list-group-item");

		//aNode.setAttribute("role", "button"); // dummy code

		aNode.innerText = results[i].trackName + " - " + results[i].artistName;

		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");
		//badgeNode.setAttribute("style", "margin: 5px;");

		badgeNode.innerText = results[i].formattedPrice;

		aNode.appendChild(badgeNode);

		//listNode.setAttribute("class", "search-result-item");
		//listNode.innerHTML = "<a href='#' class='list-group-item'>" + results[i].trackName + " - " + results[i].artistName + "</a>";

		$("#search-results").append(aNode);

		$("#search-results #item-" + i).prepend(imgNode);

		//console.log(results[i].artworkUrl60); // dummy code

		$("a#item-" + i).on("click", { name : results[i].trackName, 
									   icon : results[i].artworkUrl60,
									   publisher : results[i].artistName, 
									   oldPrice : results[i].formattedPrice, 
									   newPrice : results[i].formattedPrice }, addWishListItem);
	}
}


function hasLocalStorage()
{
	try
	{
		var storage = window.localStorage;

		storage["test"] = "this is a test";
		var x = storage["test"];
		storage.removeItem("test");

		return true;
	}
	catch (e)
	{
		console.log("Local storage not available...");

		return false;
	}
}


$( document ).ready(function() {

	$("#search-button").on("click", searchAppStore);

	$("#list-menu-button").on("click", showWishList);

	$("#search-menu-button").on("click", showSearchList);

	// hide the loading symbol on booting up

	$("#loading-symbol").addClass("symbol-hide");

	// pre-populate the wish list with any items we added during the last session

	if (hasLocalStorage())
	{
		console.log(window.localStorage); // dummy code
		populateList();
	}

});
