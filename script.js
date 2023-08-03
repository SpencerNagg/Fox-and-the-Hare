const image = document.getElementById('image')
const imageDesktop = document.getElementById('desk-image')

const context = document.getElementById('context');
const disscussion = document.getElementById('disscussion');
const labelLeft = document.getElementById('label_left');
const labelRight = document.getElementById('label_right');
const reaction = document.getElementById('reaction');

const buttonContainer = document.getElementById('buttonContainer');




const encounterOrder = ['wolf', 'bear', 'bull'];
let pageCounter = 0;

// Run the first encounter (for testing purposes?)
if (pageCounter == 0) {
  populate(encounterOrder[pageCounter]);
  pageCounter += 1;
}

async function populate(encounter) {
  const requestURL = "encounters.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const data = await response.text();

  const dataJson = JSON.parse(data);
  makeContent(dataJson, encounter)
}

function makeContent(data, encounter) {
  let encounterData = getByKey(data, encounter);

  let song = new Audio(`sound/${encounterData['song']}`);
  song.play();
  
  context.textContent = encounterData['context'];
  disscussion.textContent = encounterData['dialogue'];
  labelLeft.textContent = encounterData['labelLeft'];
  labelRight.textContent = encounterData['labelRight'];

  image.src = `images/${encounterData['image']}`
  imageDesktop.src = `images/${encounterData['image']}`


  // -------- Button workings----------
  // Make the buttons but don't add them to the document
  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue";
  continueButton.className = "button";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.className = "button";

  // Add the confirm button
  buttonContainer.append(confirmButton);
  confirmButton.addEventListener('click', () => {
    reaction.textContent = encounterData['reaction'];
    confirmButton.remove();

    // Move the button container under the reaction text
    // Add in the continue button
    buttonContainer.style.gridRow = '5';
    buttonContainer.append(continueButton);
  })

  continueButton.addEventListener('click', () => {
    song.pause();
    continueButton.remove();
    buttonContainer.style.gridRow = null;
    reaction.textContent = '';
    populate(encounterOrder[pageCounter]);
    pageCounter += 1;
  })
}

function getByKey(arr, key) {
  const foundItem = arr.find(function(x) {
    return Object.keys(x)[0] == key;
  });

  // If the item was not found
  return foundItem ? foundItem[key] : undefined;
}
