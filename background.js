var navObj={};
var currTabId;
var usedNavId;

chrome.history.onVisited.addListener(function(result)
	{
		console.log("Result is:");
		console.log(result);
		if(!result.url)
		{
			return;
		}

		var query={};
		query.url=result.url;
		chrome.tabs.query(query, function(tabs){
			console.log(tabs);

			//Get the tab that just navigated to this page
			var tabId;

			if(!tabs.length)
			{
				return;
			}

			for(var j=0; j<tabs.length; j++)
			{
				console.log("Tablength:"+tabs[j].length-1);
				//check if the last item assigned was already on this page
				if(!tabs[j][tabs[j].length-1] || tabs[j][tabs[j].length-1].url!=result.url)
				{
					tabId=tabs[j].id;
					console.log('Assign id:'+tabs[j].id);
				}
			}

			//Set up for brand new tab
			if(!navObj[tabId])
			{
				console.log("Setting up new tab!");
				navObj[tabId]={
					item: createBackObj(result),
					currId: result.id
				};
			}
			else
			{
				//set the title once finished loading
				/*if(!result.title)
				{
					chrome.tabs.get(tabId, setTitle);
				}*/

				//Attach the history 
				if(!window.usedNavId)
				{
					setChild(navObj[tabId].currId, navObj[tabId].item, result);
					navObj[currTabId].currId=result.id;
				}
				else
				{
					navObj[currTabId].currId=window.usedNavId;
					window.usedNavId=null;
				}
			}

			console.log(navObj[tabId]);
		});    
	});

chrome.tabs.onActivated.addListener(function(activeInfo)
	{
		console.log("CURRENT:"+activeInfo.tabId);
		currTabId=activeInfo.tabId;
	});

//Creates a BackObj (tree) for storing a visit and it's children
function createBackObj(visitItem)
{
	return {
		item: visitItem,
		children: []
	};
}

//Inserts a child into the given root
function insertChild(root, childVisit)
{
	console.log("Inserting child "+childVisit.id+" into "+root.item.id);
	root.children.push(createBackObj(childVisit));
}

//recursively search for the current location id in the tree within all of the roots children
function setChildHelper(currId, root, childVisit)
{
	for(i=0; i<root.children.length; i++)
	{
		if(root.children[i].item.id==currId)
		{
			insertChild(root.children[i], childVisit);
			return;
		}
		
		setChildHelper(currId, root.children[i], childVisit);
	}
}

//given the previous current location for the tab, search for and assign the child to it
function setChild(id, root, childVisit)
{
	if(root.item.id==id)
	{
		insertChild(root, childVisit);
	}
	else
	{
		setChildHelper(id, root, childVisit);
	}
}

function usedNav(id)
{
	window.usedNavId=id;
	console.log("Set usedNavId to:"+window.usedNavId);
}

//Looks for the title to be set on a page, then updates the visitItem
function setTitle(tab)
{
	if(tab.status!='loading')
	{
		navObj[tabId][navObj[tabId].length-1].title=tab.title;
	}
	else
	{
		chrome.tabs.get(tab.id, setTitle(tab));
	}
}

function getCurrTabId()
{
	return currTabId;
}

//Creates the HTML for the back tree to be displayed
function createTableHTMLHelper(child, depth)
{
	if(child.children.length==0)
	{
		console.log("No Children for "+child.item.id+" Ending!");
		return "<td><a href='"+child.item.url+"' id='"+child.item.id+"''>Title:"+child.item.title+"</a></td>";
	}
	else
	{
		console.log(child.item.id+" has children!");
		var html="<tr>";
		for(var i=0; i<child.children.length; i++)
		{
			console.log("Adding html for child of "+child.item.id+" called "+child.children[i].item.id);
			 temp=html;
			 html=temp+createTableHTMLHelper(child.children[i], depth*1+1);
		}
		var numRowsToPad=findLongestPath(navObj[currTabId].item)-depth;
		console.log("numRowsToPad:"+numRowsToPad);
		var padRowHTML=padRows(numRowsToPad);
		var rootHTML="<tr><td colspan='"+child.children.length+"'><a href='"+child.item.url+"' id='"+child.item.id+"''>Title:"+child.item.title+" </a></td></tr>";
		console.log("HTML is:"+padRowHTML+html+"</tr>"+rootHTML);
		return padRowHTML+html+"</tr>"+rootHTML;
	}
}

//create empty rows
function padRows(numRows)
{
	console.log("num Padded Rows:"+numRows);
	var padded="";
	for(var k=0; k<numRows; k++)
	{
		var padTemp=padded;
		padded="<td><br></td>"+padTemp;
	}
	console.log("Padded rows:"+padded);
	return padded;
}

function createTableHTML()
{
	console.log("Started creating HTML");
	return createTableHTMLHelper(navObj[currTabId].item, 1);
}

function findLongestPath(root)
{
	var longestPath=0;

	for(var j=0; j<root.children.length; j++)
	{
		var childLongestPath=findLongestPath(root.children[j])*1+1;
		
		if(childLongestPath>longestPath)
		{
			longestPath=childLongestPath;
		}
	}
	console.log("longestPath:"+longestPath);
	return longestPath;
}