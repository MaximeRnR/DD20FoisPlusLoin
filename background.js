function initBlocks() {
   const charName = document.querySelector(".name").innerText;
   const ability = document.querySelectorAll('.ability');
   const savingThrow = document.querySelectorAll('.saving-throw');
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
}


chrome.action.onClicked.addListener((tab) => {
   chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: initBlocks
   });
});

function roll(request) {
   let roll20ChatInput = document.querySelector('#textchat-input > textarea');
   if(request.damage){
      roll20ChatInput.value = `&{template:default} {{name=${request.charName} - ${request.label}}} {{modificateur=${request.modifier}}} {{${request.label} = [[1D20 ${request.modifier}]]}} {{degats= [[${request.damage}]]}}`
   } else {
      roll20ChatInput.value = `&{template:default} {{name=${request.charName} - ${request.label}}} {{modificateur=${request.modifier}}} {{${request.label} = [[1D20 ${request.modifier}]]}}`
   }
   roll20ChatInput.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, keyCode: 13}))
}


chrome.runtime.onMessage.addListener(
   function (request, sender, sendResponse) {
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
);



