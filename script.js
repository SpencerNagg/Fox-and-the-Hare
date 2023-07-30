const image = document.getElementById('image')
const imageDesktop = document.getElementById('desk-image')

const context = document.getElementById('context');
const disscussion = document.getElementById('disscussion');
const labelLeft = document.getElementById('label_left');
const labelRight = document.getElementById('label_right');
const reaction = document.getElementById('reaction');
const button = document.getElementById('confirm_button');


populate('bearRun')

async function populate(encounter) {
  const requestURL = "encounters.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const data = await response.text();

  const dataJson = JSON.parse(data);
  makeContent(dataJson, encounter)
}

function makeContent(data, encounter) {
  encounterData = getByKey(data, encounter);

  let song = new Audio(`sound/${encounterData['song']}`)
  // song.play();
  context.textContent = encounterData['context'];
  disscussion.textContent = encounterData['dialogue'];
  labelLeft.textContent = encounterData['labelLeft'];
  labelRight.textContent = encounterData['labelRight'];

  // Add image if there is one
  // if (encounterData['image'] != 'null') {
  //   image.src = `images/${encounterData['image']}`
  // } else {image.style.visibility = "hidden"};
  image.src = `images/${encounterData['image']}`
  imageDesktop.src = `images/${encounterData['image']}`

  button.addEventListener('click', () => {reaction.textContent = encounterData['reaction']})
}

function getByKey(arr, key) {
  const foundItem = arr.find(function(x) {
    return Object.keys(x)[0] == key;
  });

  // If the item was not found
  return foundItem ? foundItem[key] : undefined;
}
