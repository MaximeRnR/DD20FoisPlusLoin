document.querySelector('.activated').addEventListener('click', function () {
   chrome.runtime.sendMessage({msg: "initListeners"});
});
