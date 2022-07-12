
document.addEventListener('DOMContentLoaded', () => {
   new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({msg: "areListenersInitialized"}, {}, (response) => {
         if(response?.listenersInitialized){
            resolve();
         } else {
            reject();
         }
      });
   }).then(() => {
      document.querySelector('.activated').setAttribute('disabled', 'true');
      document.querySelector('.activated').innerHTML = "Lien Actif !";
   });
}, false);

document.querySelector('.activated').addEventListener('click', function () {
   new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({msg: "initListeners"}, {}, (response) => {
         if(response?.listenersInitialized){
            resolve();
         } else {
            reject();
         }
      });
   }).then(() => {
      document.querySelector('.activated').setAttribute('disabled', 'true');
      document.querySelector('.activated').innerHTML = "Lien Actif !";
   });
});
