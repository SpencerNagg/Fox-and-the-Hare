/*Looking around?*/
const body = document.body
const bottomSection = document.getElementById('lowerContainer')
const image = document.getElementById('image')
const imageDesktop = document.getElementById('desk-image')

const context = document.getElementById('context');
const disscussion = document.getElementById('disscussion');
const labelLeft = document.getElementById('label_left');
const labelRight = document.getElementById('label_right');
const reaction = document.getElementById('reaction');

const buttonContainer = document.getElementById('buttonContainer');
const slider = document.getElementById('slider');

// Globals
const encounterOrder = [
  // Opening
  'onceUpon', 'melt',

  // Main section
  'wolf', 'bear', 'bull',

  // Closing act
  'sorrow', 'rooster', 'march', 'fight', 'end', 'credits'
  ];

let pageCounter = 0;

let testGlobal = 0;

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
  console.log('testGlobal:', testGlobal);
  let encounterData = getByKey(data, encounter);
  
  let song = new Audio(`sound/${encounterData['song']}`);
  song.loop = true;
  song.play();

  // Fill in content
  body.style.backgroundColor = encounterData['background'];

  context.textContent = encounterData['context'];
  disscussion.textContent = encounterData['dialogue'];
  labelLeft.textContent = encounterData['labelLeft'];
  labelRight.textContent = encounterData['labelRight'];
  reaction.textContent = encounterData['reaction'];
  reaction.style.visibility = 'hidden';

  image.src = `images/${encounterData['image']}`
  imageDesktop.src = `images/${encounterData['image']}`

  // -------- Button workings----------
  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue";
  continueButton.className = "button";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.className = "button";

  // Add the confirm button
  buttonContainer.append(confirmButton);
  confirmButton.addEventListener('click', () => {

    testGlobal += Number(slider.value);
    reaction.style.visibility = 'inherit';

    // Remove the confirm button and add in the continue button
    confirmButton.remove();
    buttonContainer.append(continueButton);

    // Scroll to the bottom
    scrollTo(0, document.body.scrollHeight);
  })

  continueButton.addEventListener('click', () => {
    song.pause();

    // Reset the slider to the middle
    slider.value = "0";

    continueButton.remove();
    reaction.textContent = '';

    // Load the next encounter
    populate(encounterOrder[pageCounter]);

    // Move back to top of page
    scroll(0, 0)
    
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