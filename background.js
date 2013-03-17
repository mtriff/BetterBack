var navObj={};
var currTabId;

chrome.history.onVisited.addListener(function(result)
	{
		if(!result.url)
		{
			return;
		}

		var query={};
		query.url=result.url;
		chrome.tabs.query(query, function(tabs){
			console.log(tabs);


			//Assign to the tab that just got to the page
			var tabId;
			for(var j=0; j<tabs.length; j++)
			{
				console.log("Tablength:"+tabs[j].length-1);
				if(!tabs[j][tabs[j].length-1] || tabs[j][tabs[j].length-1].url!=result.url)
				{
					tabId=tabs[j].id;
					console.log('Assign id:'+tabs[j].id);
				}
			}

			//Set up navObj for the tabId
			if(!navObj[tabId])
			{
				navObj[tabId]=new Array();
			}

			//Attach the history 
			navObj[tabId].push(result);

			//set the title once finished loading
			if(!result.title)
			{
				chrome.tabs.get(tab.id, setTitle(tab));
			}

			console.log(navObj[tabId]);
		});
	});

chrome.tabs.onActivated.addListener(function(activeInfo)
	{
		console.log("CURRENT:"+activeInfo.tabId);
		currTabId=activeInfo.tabId;
	});

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
		for(var i=array.length-1; i>=0; i--)
		{
			temp=string;
			string=temp+array[i].title+"<br>";
		}
		return string;
	}
}
