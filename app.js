// 
// Main Application Logic
// 

// array to store entries in wish list

var wishList = [];

// number of new items added to wishlist

var newItems = 0;

// contains search results pertaining to most recent search

var searchResults = [];

// updates the i-th (index) item in the user's wish list (items)
// and modifies the wish list UI to reflect the newly updated info
/*function updateItemStatus(items, index, targetNode, newPrice, oldPrice, data)
{
	var prevPrice = oldPrice;

	var formattedPrice = data.results[0].formattedPrice;
	var nextPrice      = prevPrice;

	// if the 'old price' string is set to 'Free'...
	if (oldPrice === "Free")
	{
        // 'Free' corresponds to a numeric price of 0 (zero)
		prevPrice = 0;
	}
    // else if the 'old price' string contains a valid non-zero price...
	else
	{
        // extract formatted price (e.g. 10.99) from raw string (e.g. '$10.99')
		prevPrice = Number(/.(\d+\.\d+)/.exec(oldPrice)[1]);
	}

	// if the 'App Store' price is set to 'Free'...
	if (formattedPrice == "Free")
	{
        // 'Free' corresponds to a numeric price of 0 (zero)
		nextPrice = 0;
	}
    // else if the 'App Store' price is a valid, non-zero price...
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
}*/

// fills the internal wishList data structure with items saved in localStorage
function populateList()
{
	var storage = window.localStorage;

	for (var i = 0; i < storage.length; i++)
	{
		wishList.push(JSON.parse(storage["item-" + i]));
	}
}

// displays the count for newly added wish list items inside a 
// badge UI element that exists on the 'List' tab menu item
function displayNewItemsBadge()
{
	var newItemsBadge = document.getElementById("new-item-badge");

	if (newItems > 0)
	{
		// new items have been added ==> display the count of new items
		newItemsBadge.innerText = String(newItems);
	}
	else
	{
		// no new items have been added ==> remove 'new items' badge
		newItemsBadge.innerText = "";
	}
}

// updates the internal wish list and localStorage data structures
// by adding the selected app to the user's wish list
//
// NOTE: this function also handles removal of the 'add item' button
function addWishListItem(event)
{
    // if localStorage exists ==> add selected app to localStorage
	if (hasLocalStorage())
	{
		var storage = window.localStorage;

		storage["item-" + wishList.length] = JSON.stringify(event.data);
	}
    
    // append the selected app to the user's wish list
	wishList.push(event.data);
    
    // increment the count of new items added to the wish list
	newItems++;
    
    // display the count of newly added wish list items
	displayNewItemsBadge();

	// remove the 'add item' button from the selected 
    // app after it has been added to the wish list
	if (!event.target.classList.contains("symbol-hide"))
	{
		event.target.classList.add("symbol-hide");
	}
    
    // ???
	event.preventDefault();

}

// removes the selected app from the wish list UI and
// updates localStorage to reflect the newly deleted item
function deleteWishListItem(event)
{
	// disable default behavior for 'a' elements
	event.preventDefault();

	// determine the index of the list item to be removed
	var index = Number(/remove-btn-(\d+)/.exec(event.currentTarget.getAttribute("class"))[1]);

	// delete the UI element (for this item) from the wishlist (without affecting the others)
	$("#list-results #item-" + index).detach();
    
    // delete the selected app from the internal wishList structure
    wishList = wishList.slice(0, index).concat(wishList.slice(index + 1));

    // if the user has access to localStorage...
	if (hasLocalStorage())
	{
		var storage = window.localStorage;

        // delete the selected wish list item from localStorage
		storage.removeItem("item-" + index);

		// left-shift (by one) all wish list items that follow the deleted element (in localStorage)
		if (wishList.length > 0)
		{
			for (var i = index + 1; ; i++)
			{
				var storageItem = storage["item-" + i];

				if (!storageItem) break;

				storage.removeItem("item-" + i);
				storage["item-" + (i - 1)] = storageItem;
			}
		}

	}

	// left-shift (by one) the 'remove item' buttons for each item following the deleted item
	for (var i = index + 1; ; i++)
	{
		try
		{
			var removeButton = document.getElementsByClassName("remove-btn-" + i)[0]

			removeButton.classList.remove("remove-btn-" + i);
			removeButton.classList.add("remove-btn-" + (i - 1));
		}
		catch (e)
		{
			break;
		}
	}

	// left-shift (by one) the container UI elements for each item following the deleted item
	for (var i = index + 1; ; i++)
	{
		var aNode = document.querySelector("#list-results #item-" + i);

		if (!aNode) break;

		aNode.setAttribute("id", "item-" + (i - 1));
	}   
}

// retrieve the info object for the selected app 
// (uniquely identified by appName + appPublisher)
function getAppInfo(results, appName, appPublisher)
{
    var res;
    
    for (var i = 0; i < results.length; i++)
    {
        var currApp = results[i];
        
        if (currApp.trackName === appName && currApp.artistName === appPublisher)
        {   
            res = results[i];
            break;
        }
    }
    
    return res;
}

// given data (data) from the App Store, this function
// updates the app price and UI container for the 
// i-th (index) item in the user's wish list (items)
function updateWithAppStorePrice(items, index, data)
{   
	var oldPrice = 0;
	var newPrice = 0;
    
    // retrieve the latest info (for this app) from the iOS App Store
    var newInfo = getAppInfo(data.results, items[index].name, items[index].publisher);
    
    // if the old price for this app is not 'Free'...
	if (items[index].oldPrice != "Free")
	{
        // extract the numeric value (10.99) from the stored 'old price' string ('$10.99')
		oldPrice = Number(/.(\d+\.\d+)/.exec(items[index].oldPrice)[1]);
	}

    // if the new 'App Store' price for this app is not 'Free'...
	if (newInfo.formattedPrice != "Free")
	{
        // extract the numeric value (10.99) from the given 'new price' string ('$10.99')
		newPrice = Number(/.(\d+\.\d+)/.exec(newInfo.formattedPrice)[1]);
	}

    // classes for coloring each item based on price increase/drop
	var redItemColor   = "list-group-item-danger";  // price increase
	var greenItemColor = "list-group-item-success"; // price drop

    // get a reference to the i-th UI element in the wish list
	var targetNode = document.querySelector("#list-results #item-" + index);
    
    // if the price has dropped...
	if (newPrice < oldPrice)
	{
		// make the background GREEN
		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);

		if (!targetNode.classList.contains(greenItemColor))
			targetNode.classList.add(greenItemColor);
	}
    // if the price has increased...
	else if (newPrice > oldPrice)
	{
		// make the background RED
		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		if (!targetNode.classList.contains(redItemColor))
			targetNode.classList.add(redItemColor);
	}
    // if the price is unchanged...
	/*else
	{
		// make the background NEUTRAL
		if (targetNode.classList.contains(greenItemColor))
			targetNode.classList.remove(greenItemColor);

		if (targetNode.classList.contains(redItemColor))
			targetNode.classList.remove(redItemColor);
	}*/
    
    // compute the timestamp for the current time
	var updatedTime = Date.now();

	// update the price for this app to the latest 'App Store' price
	items[index].oldPrice = newInfo.formattedPrice;
    
    // set the lastUpdated timestamp to the current time
	items[index].lastUpdated = updatedTime;

	// retrieve the info for this app from localStorage
    // NOTE: we need to first check if the user has localStorage enabled...
	var itemInfo = JSON.parse(window.localStorage["item-" + index]);
    
    // update the price (in localStorage) for this app to the 'App Store' price
	itemInfo.oldPrice = newInfo.formattedPrice;
    
    // update the lastUpdated timestamp (in localStorage) for this app to the 'App Store' price
	itemInfo.lastUpdated = updatedTime;
    
    // persist the newly updated info for this app to localStorage
	window.localStorage["item-" + index] = JSON.stringify(itemInfo);

	// update the 'app price' badge with the new price value
	$("#list-results #item-" + index + " .badge").text(items[index].oldPrice);

	// create a UI element for the 'delete item button'
	var removeDiv = document.createElement("div");
    
	removeDiv.classList.add("remove-btn-" + index);
	removeDiv.innerHTML = "<i style='font-size: 30px; margin-right: 15px;' class='fa fa-minus-circle' aria-hidden='false'></i>";
    
    // attach the 'remove item' button to the UI container for this app
	$("#list-results #item-" + index).prepend(removeDiv);
    
    // trigger the 'delete' functionality when the user clicks the 'remove item' button
	removeDiv.addEventListener("click", deleteWishListItem);

}

// display the user's wish list within the main UI and retrieve the updated prices for each app
function displayList(items)
{
	var wishList = items;

    // ???
	var oldPrice     = 0;
	var updatedPrice = 0;

    // create a container UI element for each
    // app in the user's wish list and update
    // the price for each app, as needed
	for (var i = 0; i < items.length; i++)
	{
        
        // create a UI element to contain the 'app icon'
		var imgNode = document.createElement("img");

		imgNode.setAttribute("src", items[i].icon);
		imgNode.setAttribute("class", "app-icon");

        // create a UI element to contain the 'app name'
        // when clicked, this element redirects to the 
        // appropriate iOS App Store page for this app
		var aNode = document.createElement("a");
		
		aNode.setAttribute("href", "#");
		aNode.setAttribute("id", "item-" + i);
		aNode.setAttribute("class", "list-group-item");

		aNode.setAttribute("href", items[i].infoUrl);
		aNode.setAttribute("target", "_blank");

        // add publisher info to the 'app name' UI element
		aNode.innerText = items[i].name + " - " + items[i].publisher;

        // create a UI element to contain the 'app price'
		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");
        
		badgeNode.innerText = items[i].oldPrice;
        
        // attach the 'app price' alongside the 'app name'
		aNode.appendChild(badgeNode);

        // base URL for the iTunes Search API
		var iTunesUrl = "https://itunes.apple.com/search";
        
        // construct search query object for requesting data from the Search API
		var queryData = {term : items[i].name, country : "US", limit : "25", entity : "software"};

        // compute the timestamp for the current time
		var currTime = Date.now();

		// if the price for this app was last updated more than an hour ago...
		if (items[i].lastUpdated == undefined || (currTime - items[i].lastUpdated) / (60*60*1000) > 1)
		{
            // retrieve the updated price (for this app) from the App Store
			$.ajax({
			url : iTunesUrl,
			dataType : "jsonp",
			data : queryData,
			success : updateWithAppStorePrice.bind(null, items, i)
			});
		}
        
        // attach the 'app name' element to the main list UI
		$("#list-results").append(aNode);
		
        // inser the 'app icon' inside the container UI element
		$("#list-results #item-" + i).prepend(imgNode);
        
        var updateItems = (items[i].lastUpdated == undefined || (currTime - items[i].lastUpdated) / (60*60*1000) > 1);

		// if the price for this app is already up-to-date...
		if (!updateItems)
		{
            // add the 'remove item' button
			var removeDiv = document.createElement("div");

			removeDiv.classList.add("remove-btn-" + i);
			removeDiv.innerHTML = "<i style='font-size: 30px; margin-right: 15px;' class='fa fa-minus-circle' aria-hidden='false'></i>";

			$("#list-results #item-" + i).prepend(removeDiv);
            
            // trigger the 'delete' logic when the user clicks on the 'remove item' button
			removeDiv.addEventListener("click", deleteWishListItem);
		}
        
	}
}

// display the user's wish list within the main UI
function showWishList()
{
    // clear the main list display GUI
	document.getElementById("list-results").innerHTML = "";
    
    // slide the 'search results' view upwards to hide it
	$("#search-view").slideUp();
    
    // slide the 'wish list' view downwards to show it
	$("#list-view").slideDown();
    
    // un-highlight the 'Search' tab menu item
	$("#search-menu-button").removeClass("active");
    
    // highlight the 'List' tab menu item as 'active'
	$("#list-menu-button").addClass("active");

    // display the user's wish list on-screen
	displayList(wishList, true);

	// reset the count of newly added items (& remove 'new items' badge)
	newItems = 0;
	displayNewItemsBadge();
}

// display the App Store search results within the main UI
function showSearchList()
{
    // clear the main list display UI
	document.getElementById("list-results").innerHTML = "";
    
    // slide the 'wish list' view upwards to hide it
	$("#list-view").slideUp();
    
    // slide the 'search results' view downwards to show it
	$("#search-view").slideDown();
    
    // clear the previous search results from the UI
	document.getElementById("search-results").innerHTML = "";
    
    // display the results of searching for the query string in the 'Search...' text box
	displayResults(searchResults);
    
    // un-highlight the 'List' tab menu item to mark it as 'inactive'
	$("#list-menu-button").removeClass("active");
    
    // highlight the 'Search' tab menu item to mark it as 'active'
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

// checks if the browser environment supports data persistence (via localStorage)
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

// main logic that runs when the user first opens the web app
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
		populateList();
	}
    
    // display the number of new items added to the wish list
	displayNewItemsBadge();

});

