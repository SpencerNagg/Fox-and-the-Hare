const image = document.getElementById('image')
const imageDesktop = document.getElementById('desk-image')

const context = document.getElementById('context');
const disscussion = document.getElementById('disscussion');
const labelLeft = document.getElementById('label_left');
const labelRight = document.getElementById('label_right');
const reaction = document.getElementById('reaction');
const button = document.getElementById('confirm_button');

const encounterOrder = ['bearRun', 'two', 'three'];
let pageCounter = 0;

// Run the first encounter
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

  if (encounterData['song'] != 'null') {
    let song = new Audio(`sound/${encounterData['song']}`)
    song.play()
  }
  
  context.textContent = encounterData['context'];
  disscussion.textContent = encounterData['dialogue'];
  labelLeft.textContent = encounterData['labelLeft'];
  labelRight.textContent = encounterData['labelRight'];

  image.src = `images/${encounterData['image']}`
  imageDesktop.src = `images/${encounterData['image']}`
  
  let count = 0

  button.addEventListener('click', () => {
    if (count == 0) {
      reaction.textContent = encounterData['reaction'];
    } else if (count != 0) {
      populate(encounterOrder[pageCounter]);
      count = 0;
      pageCounter += 1;
    }
    count += 1;
  })
}

function getByKey(arr, key) {
  const foundItem = arr.find(function(x) {
    return Object.keys(x)[0] == key;
  });

  // If the item was not found
  return foundItem ? foundItem[key] : undefined;
}
