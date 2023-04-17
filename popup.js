document.addEventListener('DOMContentLoaded', () => {
   new Promise((resolve, reject) => {
      chrome.runtime.sendMessage("nmmpkjjaaoljgllnoonapndccolchpee", {msg: "areListenersInitialized"}, {}, (response) => {
         if(response?.listenersInitialized){
            resolve();
         } else {
            console.log(response)
            reject();
         }
      });
   }).then(() => {
      console.log("allo.")
      document.querySelector('.activated').setAttribute('disabled', 'true');
      document.querySelector('.activated').innerHTML = "Lien Actif !";
   }).catch((err) => {
      console.log(err)
   });
}, false);

document.querySelector('.activated').addEventListener('click', function () {
   new Promise((resolve, reject) => {
      chrome.runtime.sendMessage("nmmpkjjaaoljgllnoonapndccolchpee", {msg: "initListeners"}, {}, (response) => {
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


document.querySelector('.refresh').addEventListener('click', function () {
   new Promise((resolve, reject) => {
      chrome.runtime.sendMessage("nmmpkjjaaoljgllnoonapndccolchpee", {msg: "initListeners"}, {}, (response) => {
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
