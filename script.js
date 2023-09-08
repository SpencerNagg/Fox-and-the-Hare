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
  'onceUpon', 'out',

  // Main section
  'wolf', 'bear1', 'bear2', 'bear3', 'bull1', 'bull2', 'bull3', 'bull4',

  'sorrow', 'sorrow2', 'sorrow3', 'rooster', 'march', 'fight',

  ['ending1', 'ending2', 'ending3', 'ending4'], 'credits'
  ];

let pageCounter = 0;

let testGlobal = 0;

// Run the first encounter
populate(encounterOrder[pageCounter]);

async function populate(encounter) {
  // This function gets the json file the encounters are stored on
  // then calls makeContent on it
  const requestURL = "encounters.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const data = await response.text();

  const dataJson = JSON.parse(data);

  // Start loading content
  makeContent(dataJson, encounter)
}

function makeContent(data, encounter) {
  // This function loads the materials shared for all encounters
  // then checks the layout type for the encounter and calls
  // either scrollLayout or buttonLayout to do the rest
  
  console.log('testGlobal:', testGlobal);
  let encounterData = getByKey(data, encounter);

  // Fill in content
  body.style.backgroundColor = encounterData['background'];

  context.textContent = encounterData['context'];
  disscussion.textContent = encounterData['dialogue'];
  image.src = `images/${encounterData['image']}`
  imageDesktop.src = `images/${encounterData['image']}`
  reaction.textContent = 'empty string to avoid a shift upon buttonpress';
  reaction.style.visibility = 'hidden';

  if (encounterData['layout'] == 'scrollbar') {
    scrollLayout(encounterData)
  } else {
    buttonLayout(encounterData)
  }
  // Move back to top of page
  scroll(0, 0)
}

function buttonLayout(encounterData) {
  let song = new Audio(`sound/${encounterData['song']}`);
  song.loop = true;
  song.play();

  let choice;
  let buttonPressed;

  slider.style.display = 'none';

  // Apply different CSS
  buttonContainer.className = 'multiButtonContainer';

  // Create left button
  const leftButton = document.createElement("button");
  leftButton.textContent = encounterData['labelLeft'];
  leftButton.className = "button";
  leftButton.id = "leftButton";
  leftButton.addEventListener('click', () => {
    buttonPressed = true;
    // Scroll to the bottom of the screen
    scrollTo(0, document.body.scrollHeight);
    choice = 'left';

    reaction.textContent = encounterData['reaction'][0];
    // Make reaction visible again
    reaction.style.visibility = 'revert';
    leftButton.remove();
    rightButton.remove();

    // Revert the css to slidebar layout
    buttonContainer.className = 'buttonContainer'
    }
  )
  buttonContainer.append(leftButton);

  // Create right button
  const rightButton = document.createElement("button");
  rightButton.textContent = encounterData['labelRight'];
  rightButton.className = "button";
  rightButton.id = "rightButton";
  rightButton.addEventListener('click', () => {
    buttonPressed = true;
    // Scroll to the bottom of the screen
    scrollTo(0, document.body.scrollHeight);
    choice = 'right';
    reaction.textContent = encounterData['reaction'][1];
    // Make reaction visible again
    reaction.style.visibility = 'revert';
    leftButton.remove();
    rightButton.remove();

    // Revert the css to slidebar layout
    buttonContainer.className = 'buttonContainer'
    }
  )
  buttonContainer.append(rightButton);

  // Create "Continue" button
  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue";
  continueButton.className = "button";
  continueButton.id = "continue";

  // --------- Reset stuff and create next encounter upon continue----------
  continueButton.addEventListener('click', () => {
    if (buttonPressed) {
      buttonPressed = false;
      song.pause();

      slider.style.display = 'initial';

      // Reset the slider to the middle
      slider.value = "0";
      
      continueButton.remove();

      pageCounter += 1;

      // Load the next encounter
      runNext(encounterOrder, pageCounter);
    }
  })
  buttonContainer.append(continueButton);

  // Do logic needed for the choice variable to effect something
}

function scrollLayout(encounterData) {
  let song = new Audio(`sound/${encounterData['song']}`);
  song.loop = true;
  song.play();

  // Apply different CSS
  buttonContainer.className = 'buttonContainer';

  labelLeft.textContent = encounterData['labelLeft'];
  labelRight.textContent = encounterData['labelRight'];

  // Create Confirm and Continue buttons
  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue";
  continueButton.className = "button";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.className = "button";

  // -------- Confirm choice ------------
  buttonContainer.append(confirmButton);
  confirmButton.addEventListener('click', () => {
    // Scroll to the bottom of the screen
    scrollTo(0, document.body.scrollHeight);
    
    // Show reaction based on slider value
    let answer = Number(slider.value);

    // Update globals
    testGlobal += answer;
    reaction.style.visibility = 'revert';
    if (answer > 0) {
      reaction.textContent = encounterData['reaction'][0];
    } else {
      reaction.textContent = encounterData['reaction'][1];
    }

    // Remove the confirm button and add in the continue button
    confirmButton.remove();
    buttonContainer.append(continueButton);
  })

// --------- Reset stuff and create next encounter ----------
  continueButton.addEventListener('click', () => {
    song.pause();
    
    labelLeft.textContent = '';
    labelRight.textContent = '';

    // Reset the slider to the middle
    slider.value = "0";

    continueButton.remove();

    // Move back to top of page
    scroll(0, 0)

    pageCounter += 1;

    // Load the next encounter
    runNext(encounterOrder, pageCounter);
  })
}



function runNext (encounterOrder, pageCounter) {
  let encounter = encounterOrder[pageCounter];
  
  // Branching event
  if (Array.isArray(encounter)) {

    console.log("its an array yep")
    
    // Determine length of branch then apply logic
    if (encounter.length == 4) {
      if (testGlobal <= -.50) {
        populate(encounter[0])
      } else if (testGlobal <= 1) {
        populate(encounter[1])
      } else if (testGlobal <= .50) {
        populate(encounter[2])
      } else if (testGlobal > .50) {
        populate(encounter[3])
      }
    } 
  }

  // Normal non-branching event
  else {
    populate(encounterOrder[pageCounter])
  };
}

function blend(a, b, c) {
  return a + (b - a) * (1.0 + c) / 2
}

function getByKey(arr, key) {
  const foundItem = arr.find(function(x) {
    return Object.keys(x)[0] == key;
  });

  // If the item was not found
  return foundItem ? foundItem[key] : undefined;
}