document.body.innerHTML="<table border='1'>"+chrome.extension.getBackgroundPage().createTableHTML()+"</table>";

$('a').on('click', function(e) {
	console.log("recorded on click!");
	console.log(e);
  var href = e.currentTarget.href;
  chrome.extension.getBackgroundPage().usedNav(e.currentTarget.id);
  chrome.tabs.update(chrome.extension.getBackgroundPage().getCurrTabId(), {url: href});
  window.close();
});