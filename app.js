

// array to store entries in wish list

var wishList = [];


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

	wishList.push(event.data);

	console.log(window.localStorage); // dummy code
}


function deleteWishListItem(event)
{
	// determine which list item needs to be removed
	var index = parseInt(/item-(\d+)/.exec(event.currentTarget.getAttribute("id"))[1]);

	//console.log(index); // dummy code

	wishList.splice(index, 1);

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
		}
	}

	// remove this list item from the UI
	event.currentTarget.outerHTML = ""
}


function displayList(items)
{
	for (var i = 0; i < items.length; i++)
	{
		
		var aNode = document.createElement("a");
		
		aNode.setAttribute("href", "#");
		aNode.setAttribute("id", "item-" + i);
		aNode.setAttribute("class", "list-group-item");

		aNode.innerText = items[i].name + " - " + items[i].publisher;


		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");

		badgeNode.innerText = items[i].price;

		aNode.appendChild(badgeNode);

		aNode.addEventListener("click", deleteWishListItem);

		$("#list-results").append(aNode);
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

	// base url of iTunes server
	var iTunesUrl = "https://itunes.apple.com/search";

	// retrieve data from search field
	var searchText = $("#search-field").val();

	var queryData = {term : searchText, country : "US", limit : "10", entity : "software"};

	// retrieve search results from iTunes server
	$.getJSON(iTunesUrl, queryData, function(data) {

		//console.log(data); // dummy code

		var results = data.results;

		displayResults(results);

	});
}


function displayResults(results)
{
	// display search results on the page
	for (var i = 0; i < results.length; i++)
	{
		//var listNode = document.createElement("li");

		var aNode = document.createElement("a");
		
		aNode.setAttribute("href", "#");
		aNode.setAttribute("id", "item-" + i);
		aNode.setAttribute("class", "list-group-item");

		aNode.innerText = results[i].trackName + " - " + results[i].artistName;

		var badgeNode = document.createElement("span");

		badgeNode.setAttribute("class", "badge");
		//badgeNode.setAttribute("style", "margin: 5px;");

		badgeNode.innerText = results[i].formattedPrice;

		aNode.appendChild(badgeNode);

		//listNode.setAttribute("class", "search-result-item");
		//listNode.innerHTML = "<a href='#' class='list-group-item'>" + results[i].trackName + " - " + results[i].artistName + "</a>";

		$("#search-results").append(aNode);

		$("a#item-" + i).on("click", { name : results[i].trackName, publisher : results[i].artistName, price : results[i].formattedPrice }, addWishListItem);
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

	// pre-populate the wish list with any items we added during the last session

	if (hasLocalStorage())
	{
		console.log(window.localStorage); // dummy code
		populateList();
	}

});

