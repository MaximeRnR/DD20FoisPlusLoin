function initListeners() {
   const charName = document.querySelector(".name").innerText;
   const ability = document.querySelectorAll('.ability');
   const savingThrow = document.querySelectorAll('.saving-throw .saving-throw');
   const attackCell = document.querySelectorAll('.hit-cell');

   const initiative = document.querySelector('.initiative');
   initiative.addEventListener('click', () => {
      chrome.runtime.sendMessage({label: 'Initiative', modifier: initiative.querySelector('.value').innerText, charName: charName});
   })
   ability.forEach(element => {
      element.addEventListener('click', () => {
         const label = element.querySelector('.label').innerText;
         const modifier = element.querySelector('.modifier').innerText;
         chrome.runtime.sendMessage({label: label, modifier: modifier, charName: charName});
      })
   });
   savingThrow.forEach(element => {
      element.addEventListener('click', () => {
         const label = element.querySelector('.label').innerText;
         const modifier = element.querySelector('.modifier').innerText;
         chrome.runtime.sendMessage({label: `Jet de sauvegarde : ${label}`, modifier: modifier, charName: charName});
      })
   });
   attackCell.forEach(element => {
      element.addEventListener('click', () => {
         const label = element.parentElement.querySelectorAll('td')[0].innerText;
         let damage = element.parentElement.querySelectorAll('td')[3].innerText;
         damage = damage.split('(').join('[').split(')').join(']');
         const modifier = element.innerText;
         chrome.runtime.sendMessage({label: `Attaque : ${label}`, modifier: modifier, charName: charName, damage: damage});
      })
   });

   const optionsDialog = document.createElement("div");
   optionsDialog.style.width = "8%";
   optionsDialog.style.height = "150px";
   optionsDialog.style.background = "white";
   optionsDialog.style.display =  "flex";
   optionsDialog.style.justifyContent =  "center";
   optionsDialog.style.alignItems =  "center";
   optionsDialog.style.position = "fixed";
   optionsDialog.style.top = "75px";
   optionsDialog.style.left = "12px";

   const headerElement = document.createElement("div");
   headerElement.classList.add("color-header");
   headerElement.style.position = "absolute";
   headerElement.style.top = "0";
   headerElement.style.background = "#3b64de";
   headerElement.style.height = "8px";
   headerElement.style.width = "100%";
   optionsDialog.append(headerElement);

   const avantageElement = document.createElement("button");
   avantageElement.classList.add("button");
   avantageElement.innerHTML = "AVANTAGE";
   avantageElement.style.width = "fit-content";
   optionsDialog.append(avantageElement);
   document.body.append(optionsDialog);
   console.log("Lien Roll20 & DDPLUSLOIN initialisé.");
}

function roll(request) {
   let roll20ChatInput = document.querySelector('#textchat-input > textarea');
   if(request.damage){
      roll20ChatInput.value = `&{template:default} {{name=${request.charName} - ${request.label}}} {{modificateur=${request.modifier}}} {{${request.label} = [[1D20 ${request.modifier}]]}} {{degats= [[${request.damage}]]}}`
   } else {
      roll20ChatInput.value = `&{template:default} {{name=${request.charName} - ${request.label}}} {{modificateur=${request.modifier}}} {{${request.label} = [[1D20 ${request.modifier}]]}}`
   }
   roll20ChatInput.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, keyCode: 13}));
}


chrome.runtime.onMessage.addListener(
   function (request, sender, sendResponse) {
      console.log(request);
      if (request.msg === "initListeners") {
         chrome.tabs.query({url: "*://ddplusloin.herokuapp.com/*"}, function (tabs) {
            for (const tab of tabs) {
               chrome.scripting.executeScript({
                  target: {tabId: tab.id},
                  function: initListeners,
               });
            }
         });
      } else {
         chrome.tabs.query({url: "*://app.roll20.net/*"}, function (tabs) {
            for (const tab of tabs) {
               chrome.scripting.executeScript({
                  target: {tabId: tab.id},
                  function: roll,
                  args: [request]
               });
            }
         });
      }
   }
);



