function initListeners() {
   if (!document.querySelector(".option-roll20")) {
      let advantage = false;
      const charName = document.querySelector(".name").innerText;
      const ability = document.querySelectorAll('.ability');
      const savingThrow = document.querySelectorAll('.saving-throw .saving-throw');
      const attackCell = document.querySelectorAll('.hit-cell');

      function getAdvantage() {
         return advantage;
      }

      const initiative = document.querySelector('.initiative');
      initiative.addEventListener('click', () => {
         chrome.runtime.sendMessage({
            label: 'Initiative',
            modifier: initiative.querySelector('.value').innerText,
            charName: charName,
            advantage: getAdvantage()
         });
      })
      ability.forEach(element => {
         element.addEventListener('click', () => {
            const label = element.querySelector('.label').innerText;
            const modifier = element.querySelector('.modifier').innerText;
            chrome.runtime.sendMessage({
               label: label,
               modifier: modifier,
               charName: charName,
               advantage: getAdvantage()
            });
         })
      });
      savingThrow.forEach(element => {
         element.addEventListener('click', () => {
            const label = element.querySelector('.label').innerText;
            const modifier = element.querySelector('.modifier').innerText;
            chrome.runtime.sendMessage({
               label: `Jet de sauvegarde : ${label}`,
               modifier: modifier,
               charName: charName,
               advantage: getAdvantage()
            });
         })
      });
      attackCell.forEach(element => {
         element.addEventListener('click', () => {
            const label = element.parentElement.querySelectorAll('td')[0].innerText;
            let damage = element.parentElement.querySelectorAll('td')[3].innerText;
            const roll20Damage = damage.split('(').join('[').split(')').join(']');
            let foundryDamage = damage.split(/ *\([^)]*\) */g);
            foundryDamage.splice(foundryDamage.length - 1, 1);
            foundryDamage.join(" + ");
            const modifier = element.innerText;
            chrome.runtime.sendMessage({
               label: `Attaque : ${label}`,
               modifier: modifier,
               charName: charName,
               damage: {roll20: roll20Damage, foundry: foundryDamage},
               advantage: getAdvantage()
            });
         })
      });

      const optionsDialog = document.createElement("div");
      optionsDialog.classList.add("option-roll20")
      optionsDialog.style.width = "10%";
      optionsDialog.style.height = "150px";
      optionsDialog.style.background = "white";
      optionsDialog.style.display = "flex";
      optionsDialog.style.flexDirection = "column";
      optionsDialog.style.justifyContent = "center";
      optionsDialog.style.alignItems = "center";
      optionsDialog.style.position = "fixed";
      optionsDialog.style.top = "100px";
      optionsDialog.style.left = "12px";
      optionsDialog.style.border = "1px solid #3b64de";
      optionsDialog.style.zIndex = "2";

      const headerElement = document.createElement("div");
      headerElement.classList.add("color-header");
      headerElement.style.position = "absolute";
      headerElement.style.top = "0";
      headerElement.style.background = "#3b64de";
      headerElement.style.height = "8px";
      headerElement.style.width = "100%";
      optionsDialog.append(headerElement);

      const titleElement = document.createElement("h2");
      titleElement.innerHTML = "Options Roll20";
      titleElement.style.fontWeight = "bold";
      titleElement.style.textAlign = "center";

      const buttonContainer = document.createElement("div")
      buttonContainer.style.background = "white";
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "center";
      buttonContainer.style.alignItems = "center";
      buttonContainer.style.border = "2px solid #3b64de";
      buttonContainer.style.borderRadius = "10px";

      const normalElement = document.createElement("button");
      const advantageElement = document.createElement("button");


      normalElement.classList.add("button");
      normalElement.innerHTML = "Normal";
      normalElement.style.width = "fit-content";
      normalElement.style.background = "#3b64de";
      normalElement.style.borderRadius = "5px 0 0 5px";
      normalElement.style.color = "white";
      normalElement.addEventListener('click', () => {
         advantage = false;
         normalElement.style.borderRadius = "5px 0 0 5px";
         normalElement.style.background = "#3b64de";
         normalElement.style.color = "white";
         advantageElement.style.borderRadius = "0 10px 10px 0";
         advantageElement.style.background = "white";
         advantageElement.style.color = "#3b64de";
      });

      advantageElement.classList.add("button");
      advantageElement.innerHTML = "Avantage";
      advantageElement.style.width = "fit-content";
      advantageElement.style.borderRadius = "0 10px 10px 0";
      advantageElement.style.background = "white";
      advantageElement.style.color = "#3b64de";
      advantageElement.addEventListener('click', () => {
         advantage = true;
         normalElement.style.borderRadius = "10px 0 0 10px";
         normalElement.style.background = "white";
         normalElement.style.color = "#3b64de";
         advantageElement.style.borderRadius = "0 5px 5px 0";
         advantageElement.style.background = "#3b64de";
         advantageElement.style.color = "white";
      });

      buttonContainer.append(normalElement);
      buttonContainer.append(advantageElement);
      optionsDialog.append(titleElement);
      optionsDialog.append(buttonContainer);
      document.body.append(optionsDialog);
      console.log("Lien Roll20 & DDPLUSLOIN initialisé.");
      setInterval(() => {
         console.log("Keeping link between Roll20 and DDPL alive !");
         chrome.runtime.sendMessage({msg: "keep-alive"})
      }, 30000)
   }
}

function roll(request) {
   let roll20ChatInput = document.querySelector('#textchat-input > textarea');
   if (request.damage) {
      roll20ChatInput.value = `&{template:default} {{name=${request.charName} - ${request.label}}} {{modificateur=${request.modifier}}} {{${request.label} = [[1D20 ${request.modifier}]] ${request.advantage ? `| [[1D20 ${request.modifier}]]` : ''}}} {{degats= [[${request.damage.roll20}]]}}`
   } else {
      roll20ChatInput.value = `&{template:default} {{name=${request.charName} - ${request.label}}} {{modificateur=${request.modifier}}} {{${request.label} = [[1D20 ${request.modifier}]] ${request.advantage ? `| [[1D20 ${request.modifier}]]` : ''}}}`
   }
   roll20ChatInput.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, keyCode: 13}));
}

function rollFoundry(request) {
   let diceToRolls = request.advantage ? '2D20kh' : '1D20';
   let roll20ChatInput = document.querySelector('.window-content #chat-form #chat-message') ?? document.querySelector('#sidebar #chat-form #chat-message');
   roll20ChatInput.value = `${request.label}: [[${diceToRolls}${request.modifier}]]
   ${request.damage ? `Dégats : [[/r ${request.damage.foundry}]]` : ""}`;
   let rollChatButton = document.querySelector('.window-content #chat > section > div.dice-tray__math.flexrow > button.dice-tray__roll') ?? document.querySelector('#sidebar #chat > section > div.dice-tray__math.flexrow > button.dice-tray__roll');
   rollChatButton.dispatchEvent(new Event('click'));
}

function removePopup(){
   document.querySelector(".option-roll20")?.remove();
}

let listenersInitialized = false;

function areListenersInitialized(){
   return listenersInitialized;
}

function handleUpdated(tabId, changeInfo, tabInfo) {
   if (changeInfo?.url?.includes("ddplusloin")) {
      listenersInitialized = false;
      chrome.tabs.query({url: "*://ddplusloin.herokuapp.com/*"}, function (tabs) {
         for (const tab of tabs) {
            chrome.scripting.executeScript({
               target: {tabId: tab.id},
               function: removePopup
            });
         }
      });
   }
}

// Handles Messages from popup.js and DDPlusLoin content-script.
chrome.runtime.onMessage.addListener(
   function (request, sender, sendResponse) {
      if (request.msg === "areListenersInitialized") {
         sendResponse({listenersInitialized: areListenersInitialized()});
         return;
      }
      if (request.msg === "initListeners") {
         listenersInitialized = true;
         chrome.tabs.query({url: "*://ddplusloin.herokuapp.com/*"}, function (tabs) {
            for (const tab of tabs) {
               chrome.scripting.executeScript({
                  target: {tabId: tab.id},
                  function: initListeners,
               });
            }
         });
         sendResponse({listenersInitialized: areListenersInitialized()});
         return;
      }
      if(request.msg === "keep-alive"){
         setTimeout(() => console.log("stayin' alive"), 30000);
         sendResponse({ok: "ok"});
         return;
      }
      chrome.tabs.query({url: "*://app.roll20.net/*"}, function (tabs) {
         for (const tab of tabs) {
            chrome.scripting.executeScript({
               target: {tabId: tab.id},
               function: roll,
               args: [request]
            });
         }
      });
      chrome.tabs.query({url: "*://*/*"}, function (tabs) {
         for (const tab of tabs) {
            chrome.scripting.executeScript({
               target: {tabId: tab.id},
               function: rollFoundry,
               args: [request]
            });
         }
      });
   }
);

// Message From DDPLUSLOIN checking if extension is install and activated.
chrome.runtime.onMessageExternal.addListener(
   function (request, sender, sendResponse) {
      sendResponse({listenersInitialized: areListenersInitialized()});
   }
);

// If DDPLUSLOIN tab is updated then remove popup and reset listenerInitialized.
chrome.tabs.onUpdated.addListener(handleUpdated);

