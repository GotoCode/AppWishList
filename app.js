// 
// Main Application Logic
// 

// array to store entries in wish list

var wishList = [];

// number of new items added to wishlist

var newItems = 0;

// contains search results pertaining to most recent search

var searchResults = [];

// TODO
function updateItemStatus(items, index, targetNode, newPrice, oldPrice, data)
{
	//console.log("before oldPrice:", items[index].newPrice);
	//console.log("before newPrice:", data.results[0].formattedPrice);

	var prevPrice = oldPrice;

	//console.log("newPrice:", newPrice); // dummy code

	var formattedPrice = data.results[0].formattedPrice;
	var nextPrice      = prevPrice;

	//console.log("after oldPrice:", oldPrice); // dummy code
	//console.log("after newPrice:", newPrice); // dummy code

	// replace the ternary operator with if-else statements

	if (oldPrice === "Free")
	{
        // 'Free' corresponds to a numeric price of 0 (zero)
		prevPrice = 0;
	}
	else
	{
        // extract formatted price (e.g. 10.99) from raw string (e.g. '$10.99')
		prevPrice = Number(/.(\d+\.\d+)/.exec(oldPrice)[1]);
	}

	// DO NOT use the ternary operator

	if (formattedPrice == "Free")
	{
        // 'Free' corresponds to a numeric price of 0 (zero)
		nextPrice = 0;
	}
	else
	{
        // extract formatted price (e.g. 10.99) from raw string (e.g. '$10.99')
		nextPrice = Number(/.(\d+\.\d+)/.exec(formattedPrice)[1]);
	}

    // class names for coloring list item backgrounds
	var redItemColor   = "list-group-item-danger";  // price increase color
	var greenItemColor = "list-group-item-success"; // price decrease color
    
    // if the app price has dropped...
	if (nextPrice < prevPrice)
	{
		// color the list item for this app GREEN
        
		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);

		if (!targetNode.classList.contains(greenItemColor))
			targetNode.classList.add(greenItemColor);
	}
    // if the app price has increased...
	else if (nextPrice > prevPrice)
	{
		// color the list item for this app RED

		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		if (!targetNode.classList.contains(redItemColor))
			targetNode.classList.add(redItemColor);
	}
    // if the app price is unchanged...
	else
	{
		// set color to NEUTRAL for this list-item
		
		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);

		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);
	}

	// if the app has not yet been deleted...
	if (items[index])
	{
		// update the price for the given app
		items[index].oldPrice = items[index].newPrice;
		items[index].newPrice = formattedPrice;
	}

	//console.log("nextPrice:", nextPrice); // dummy code
	//console.log("prevPrice:", prevPrice); // dummy code

	//waitingForResponse = false;

	//console.log("new oldPrice:", items[index].oldPrice);
	//console.log("new newPrice:", items[index].newPrice);
}

// TODO
function populateList()
{
	var storage = window.localStorage;

	for (var i = 0; i < storage.length; i++)
	{
		wishList.push(JSON.parse(storage["item-" + i]));
	}
}

// TODO
function displayNewItemsBadge()
{
	var newItemsBadge = document.getElementById("new-item-badge");

	if (newItems > 0)
	{
		// display the count of new items

		newItemsBadge.innerText = String(newItems);
	}
	else
	{
		// no new items have been added

		newItemsBadge.innerText = "";
	}
}

// CONTINUE CODE REVIEW HERE //
function addWishListItem(event)
{
	if (hasLocalStorage())
	{
		var storage = window.localStorage;

		storage["item-" + wishList.length] = JSON.stringify(event.data);
	}

	//console.log(event.data); // dummy code

	wishList.push(event.data);

	// display updated count of new items

	newItems++;

	displayNewItemsBadge();

	// remove the add button from this item, since it's already on the wish list
	if (!event.target.classList.contains("symbol-hide"))
	{
		console.log("added the class!"); // dummy code
		event.target.classList.add("symbol-hide");
	}

	event.preventDefault(); // dummy code

	//console.log(window.localStorage); // dummy code
}

// TODO
function deleteWishListItem(event)
{
	// prevent handling of anchor tag click-through
	event.preventDefault();

	// determine which list item needs to be removed
	var index = Number(/remove-btn-(\d+)/.exec(event.currentTarget.getAttribute("class"))[1]);

	//console.log(index); // dummy code

	//console.log(event.currentTarget.getAttribute("id")) // dummy code
	console.log(wishList.splice(index, 1)); // dummy code

	//console.log(document.querySelector("#list-results #item-" + index)); // dummy code

	// remove this item from the wishlist (without affecting the others)
	$("#list-results #item-" + index).detach();

	if (hasLocalStorage())
	{
		var storage = window.localStorage;

		storage.removeItem("item-" + index);

		// re-adjust indices for each item in localStorage

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

		//document.getElementById("list-results").innerHTML = "";

		//displayList(wishList, false);

		//console.log(wishList); // dummy code
	}

	// re-adjust indices for each remove-btn
	for (var i = index + 1; ; i++)
	{
		try
		{
			var removeButton = document.getElementsByClassName("remove-btn-" + i)[0]

			removeButton.classList.remove("remove-btn-" + i);
			removeButton.classList.add("remove-btn-" + (i - 1));

			console.log(removeButton); // dummy code
		}
		catch (e)
		{
			break;
		}
	}

	// re-adjust indices for each listed item
	for (var i = index + 1; ; i++)
	{
		var aNode = document.querySelector("#list-results #item-" + i);

		if (!aNode) break;

		aNode.setAttribute("id", "item-" + (i - 1));

		console.log(aNode); // dummy code
	}

	//event.currentTarget.parentNode.innerHTML = ""; // dummy code

	// remove this list item from the UI
	//event.currentTarget.outerHTML = ""

	//document.getElementById("item" + index).outerHTML = "";
}

// TODO
function testFunction(items, index, data)
{
	console.log("items:", items); // dummy code
	console.log("index:", index); // dummy code

	console.log("oldPrice:", items[index].oldPrice);          // dummy code
	console.log("newPrice:", data.results[0].formattedPrice); // dummy code

	var prevPrice = 0;
	var nextPrice = 0;

	if (items[index].oldPrice != "Free")
	{
		prevPrice = Number(/.(\d+\.\d+)/.exec(items[index].oldPrice)[1]);
	}

	if (data.results[0].formattedPrice != "Free")
	{
		nextPrice = Number(/.(\d+\.\d+)/.exec(data.results[0].formattedPrice)[1]);
	}

	var redItemColor   = "list-group-item-danger";
	var greenItemColor = "list-group-item-success";

	var targetNode = document.querySelector("#list-results #item-" + index);

	//console.log("targetNode:", targetNode); // dummy code

	// DEBUG ONLY //
	
	/*
	if (nextPrice == 0)
	{
		nextPrice += 1.99;
	}
	else
	{
		nextPrice -= 0.99;
	}
	*/

	//console.log("prevPrice:", prevPrice); // dummy code
	//console.log("nextPrice:", nextPrice); // dummy code

	if (nextPrice < prevPrice)
	{
		// make the background GREEN
		
		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);

		if (!targetNode.classList.contains(greenItemColor))
			targetNode.classList.add(greenItemColor);
	}
	else if (nextPrice > prevPrice)
	{
		// make the background RED

		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		if (!targetNode.classList.contains(redItemColor))
			targetNode.classList.add(redItemColor);
	}
	else
	{
		// make the background NEUTRAL

		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);
	}

	// update the price of the app to the latest up-to-date value
	
	console.log("nextPrice:", nextPrice);

	var updatedTime = Date.now();

	// update the current wish list
	items[index].oldPrice = data.results[0].formattedPrice;
	items[index].lastUpdated = updatedTime;

	// update localStorage to reflect this change
	var itemInfo = JSON.parse(window.localStorage["item-" + index]);

	itemInfo.oldPrice    = data.results[0].formattedPrice;
	itemInfo.lastUpdated = updatedTime;

	window.localStorage["item-" + index] = JSON.stringify(itemInfo);

	console.log(items[index].oldPrice); // dummy code

	// update the price badge with the new price value
	$("#list-results #item-" + index + " .badge").text(items[index].oldPrice);

	// allow user to remove app only AFTER we have computed the price change

	var removeDiv = document.createElement("div");

	removeDiv.classList.add("remove-btn-" + index);
	removeDiv.innerHTML = "<i style='font-size: 30px; margin-right: 15px;' class='fa fa-minus-circle' aria-hidden='false'></i>";

	$("#list-results #item-" + index).prepend(removeDiv);

	removeDiv.addEventListener("click", deleteWishListItem);

	console.log("targetNode:", targetNode); // dummy code

	console.log("");
}

// TODO
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

		aNode.setAttribute("href", items[i].infoUrl);
		aNode.setAttribute("target", "_blank");

		//aNode.setAttribute("role", "button"); // dummy code

		aNode.innerText = items[i].name + " - " + items[i].publisher;


		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");

		//console.log(items[i].newPrice); // dummy code

		newPrice = items[i].newPrice; // dummy code

		badgeNode.innerText = items[i].oldPrice; // uncomment this when ready...

		aNode.appendChild(badgeNode);

		//aNode.addEventListener("click", deleteWishListItem);

		/*
		var removeDiv = document.createElement("div");

		//aNode.setAttribute("id", "item-" + i);
		removeDiv.classList.add("remove-btn-" + i);
		removeDiv.innerHTML = "<i style='font-size: 30px; margin-right: 15px;' class='fa fa-minus-circle' aria-hidden='false'></i>";
		*/

		var iTunesUrl = "https://itunes.apple.com/search";
		var queryData = {term : items[i].name, country : "US", limit : "10", entity : "software"};

		//console.log(wishList[j].name, wishList[j].newPrice); // dummy code

		//while (waitingForResponse);

		// retrieve search results from iTunes server
		/*$.getJSON(iTunesUrl, queryData, updateItemStatus.bind(null, items, i, aNode, newPrice));*/

		var currTime = Date.now();

		var updateItems = items[i].lastUpdated == undefined || (currTime - items[i].lastUpdated) / (60*60*1000) > 1;

		// if the price for this app was retrieved more than an hour ago...
		if (updateItems)
		{
			//waitingForResponse = true;

			//console.log(wishList[i]); // dummy code

			$.ajax({
			url : iTunesUrl,
			dataType : "jsonp",
			data : queryData,
			success : testFunction.bind(null, items, i)
			});
		}

		$("#list-results").append(aNode);
		
		$("#list-results #item-" + i).prepend(imgNode);

		// if we didn't fetch any results from server, then keep the remove button as is

		if (!updateItems)
		{
			var removeDiv = document.createElement("div");

			removeDiv.classList.add("remove-btn-" + i);
			removeDiv.innerHTML = "<i style='font-size: 30px; margin-right: 15px;' class='fa fa-minus-circle' aria-hidden='false'></i>";

			$("#list-results #item-" + i).prepend(removeDiv);

			removeDiv.addEventListener("click", deleteWishListItem);
		}

		//removeDiv.addEventListener("click", deleteWishListItem);
	}
}

// TODO
function showWishList()
{

	document.getElementById("list-results").innerHTML = "";

	$("#search-view").slideUp();
	$("#list-view").slideDown();

	$("#search-menu-button").removeClass("active");
	$("#list-menu-button").addClass("active");

	displayList(wishList, true);

	// reset the count of new items
	newItems = 0;
	displayNewItemsBadge();
}

// TODO
function showSearchList()
{
	document.getElementById("list-results").innerHTML = "";

	$("#list-view").slideUp();
	$("#search-view").slideDown();

	document.getElementById("search-results").innerHTML = "";

	displayResults(searchResults);

	$("#list-menu-button").removeClass("active");
	$("#search-menu-button").addClass("active");
}

// constructs a search query object and uses it to
// search iTunes for results matching the given query
// specified by the user in the 'Search...' input field
function searchAppStore(e)
{
    // override the default 'submit button' functionality
	e.preventDefault();

	// clear the list of search results
	$("a.list-group-item").replaceWith("");

	// display the loading symbol
	$("#loading-symbol").removeClass("symbol-hide");

	// base url for iTunes Search API
	var iTunesUrl = "https://itunes.apple.com/search";

	// retrieve search query from 'Search...' text field
	var searchText = $("#search-field").val();
    
    // specify parameters & meta-data for search query
	var queryData = {term : searchText, country : "US", limit : "10", entity : "software"};
    
    // send an (async) GET request to the Search API using the given query data
	$.ajax({
			url : iTunesUrl,
			dataType : "jsonp",
			data : queryData,
			success : function(data) {
                // display the list of search results in the GUI
				searchResults = data.results;
				displayResults(searchResults);
			}
		});
}

// function to search for a given app (by name) in the user's wish list
function wishListContains(appName)
{
	for (var i = 0; i < wishList.length; i++)
	{
		if (wishList[i].name == appName)
		{
			return true;
		}
	}

	return false;
}

// displays (& configures) a list of UI elements which shows the user each item in the list of search results
function displayResults(results)
{
	// if the loading symbol is (currently) visible ==> hide it from view
	if (!document.getElementById("loading-symbol").classList.contains("symbol-hide"))
	{
		$("#loading-symbol").addClass("symbol-hide");
	}

	// iterate over each item in the given list and
    // display the various fields for each object
    // by building up a 'container' UI element
	for (var i = 0; i < results.length; i++)
	{
        // create container for app icon
		var imgNode = document.createElement("img");

		imgNode.setAttribute("src", results[i].artworkUrl60);
		imgNode.setAttribute("class", "app-icon");

        // create container for the app name, which redirects
        // to the iOS app store when the user clicks on it
		var aNode = document.createElement("a");
		
		aNode.setAttribute("href", "#");
		aNode.setAttribute("id", "item-" + i);
		aNode.setAttribute("class", "list-group-item");

		aNode.setAttribute("href", results[i].trackViewUrl);
		aNode.setAttribute("target", "_blank");

		aNode.innerText = results[i].trackName;

        // create container for the app's price
		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");

		badgeNode.innerText = results[i].formattedPrice;
        
        // attach the price alongside the 'app name' element
		aNode.appendChild(badgeNode);
        
		inWishList = wishListContains(results[i].trackName);
        
        // if this item is not already in our wish list ==> create an 'add item' UI element
		if (!inWishList)
		{
			var addDiv = document.createElement("div");

			addDiv.classList.add("add-btn-" + i);
			addDiv.innerHTML = "<i style='font-size: 30px; margin-right: 15px;' class='fa fa-plus-circle' aria-hidden='false'></i>";
		}
        
        // add the newly created container element to the full list of search results
		$("#search-results").append(aNode);
        
        // insert the app icon within the container UI element
		$("#search-results #item-" + i).prepend(imgNode);
        
        // insert the 'add item' button within the container UI element
		if (!inWishList)
		{
			$("#search-results #item-" + i).prepend(addDiv);
		}
        
        // set up a callback function which adds this item to the
        // user's wish list when they click the 'add item' button
		$("#search-results #item-" + i + " .add-btn-" + i).on("click", { name : results[i].trackName, 
									   									 icon : results[i].artworkUrl60,
									   									 infoUrl : results[i].trackViewUrl,
									   									 publisher : results[i].artistName, 
									   									 oldPrice : results[i].formattedPrice, 
									   									 newPrice : results[i].formattedPrice }, addWishListItem);
	}
}

// TODO
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

// TODO
$( document ).ready(function() {
    
    // trigger the searchAppStore function when the user clicks the 'Search' button
	$("#search-button").on("click", searchAppStore);
    
    // trigger the showWishList function when the user clicks the 'Search' tab menu item
	$("#list-menu-button").on("click", showWishList);
    
    // trigger the showSearchList function when the user clicks the 'List' tab menu item
	$("#search-menu-button").on("click", showSearchList);

	// hide the 'results loading' symbol when the app first starts up
	$("#loading-symbol").addClass("symbol-hide");

	// pre-populate the wish list with any items we saved during the previous session
	if (hasLocalStorage())
	{
		//console.log(window.localStorage);
		populateList();
	}
    
    // display the number of new items added to the wish list
	displayNewItemsBadge();

});

