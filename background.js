var navObj={};
var currTabId;

chrome.history.onVisited.addListener(function(result)
	{
		var query={};
		query.url=result.url;
		chrome.tabs.query(query, function(tabs){
			console.log(tabs);

			var tabId=tabs[0].id;

			if(!navObj[tabId])
			{
				navObj[tabId]=new Array();
			}

			navObj[tabId].push(result);

			console.log(navObj[tabId]);
		});
	});

chrome.tabs.onActivated.addListener(function(activeInfo)
	{
		console.log("CURRENT:"+activeInfo.tabId);
		currTabId=activeInfo.tabId;
	});

function returnBodyHTML()
{
	return document.body.innerHTML;
}

function getNav()
{
	if(!navObj[currTabId])
	{
		return "";
	}
	else
	{
		var string="";
		var array=Array.prototype.slice.call(navObj[currTabId]);
		for(var i=0; i<array.length; i++)
		{
			temp=string;
			string=temp+array[i].title+"<br>";
		}
		return string;
	}
}
