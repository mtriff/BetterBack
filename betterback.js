console.log(chrome.extension.getBackgroundPage().returnBodyHTML());
document.body.innerHTML=chrome.extension.getBackgroundPage().getNav();