window.addEventListener('load', () => {
  init();
});

const gameSettings = {
  score: 0,
  time: 700,
  timeBooster: 1,
  gameSequenceColors: [],
  userSequenceColors: [],
}

/* Initialization Of The Game */
const init = () => {
  /* Add color to the game array */
  addGameSequenceColor();
  /* Add color to the game array */
  getSequenceColors();
}

const addUserSequenceColors = (color) => {
  const colors = document.querySelectorAll('.main-container div');
  /* Remove class active */
  removeActiveColors();
  /* Add class active */
  color.classList.add('active');
  /* Add selected color to user sequence */
  gameSettings.userSequenceColors.push(color.classList[0]);
  /* Play select sequence */
  playSelectAudio();
  /* When user sequence array is equal to game sequence array check them */
  if (gameSettings.gameSequenceColors.length === gameSettings.userSequenceColors.length && arrayCompare(gameSettings.gameSequenceColors, gameSettings.userSequenceColors)) {
    gameSettings.score++;
    gameSettings.timeBooster -= .1;

    setTimeout(() => { 
      removeActiveColors();
      /* Remove event listener */
      colors.forEach(color => color.onclick = null);
      /* Reset user sequence */
      gameSettings.userSequenceColors = [];
      /* Add new color to sequence */
      addGameSequenceColor();
      /* Show sequence colors */
      getSequenceColors();

      console.log(gameSettings.gameSequenceColors, gameSettings);

    }, gameSettings.time * gameSettings.timeBooster);

  } else if (gameSettings.gameSequenceColors.length <= gameSettings.userSequenceColors.length) {
    document.body.innerHTML = 'Game Over';
  }
}

const addGameSequenceColor = () => {
  /* Generate random number */
  const int = Math.floor(Math.random() * 4);
  /* Numbers of the colors */
  const colors = {
    green: 0,
    red: 1,
    yellow: 2,
    blue: 3,
  }
  /* Adding new color to game array */
  for(const key in colors) {
    if (int === colors[key]) gameSettings.gameSequenceColors.push(key);
  }
}

const getSequenceColors = () => {
  let i = 0;
  const colors = document.querySelectorAll('.main-container div');

  const interval = setInterval(() => {
    /* Selecting colors via game colors array and adding class to active color */
    removeActiveColors();
    document.querySelector(`.${ gameSettings.gameSequenceColors[i] }`).classList.add('active');

    /* Play color sequence */
    playColorAudio();
    
    /* Iterate index */
    i++;

    /* Stop interval when array ends */
    if (i === gameSettings.gameSequenceColors.length) {
      /* Reset index */
      i = 0;
      /* Clear interval */
      clearInterval(interval);
      /* Timeout events */
      setTimeout(() => { 
        /* Remove class active */
        removeActiveColors();
        /* Add event listener onclick select color */
        colors.forEach(color => {
          color.onclick = () => { addUserSequenceColors(color) };
        });
      }, gameSettings.time * gameSettings.timeBooster);
    }

  }, gameSettings.time * gameSettings.timeBooster);
}

const removeActiveColors = () => {
  document.querySelectorAll('.main-container div').forEach(color => color.classList.remove('active'));
}

const playColorAudio = () => {
  const audio = new Audio('./media/step.wav');
  audio.play();
}

const playSelectAudio = () => {
  const audio = new Audio('./media/select.wav');
  audio.play();
}

function arrayCompare(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length) return false;
  
  const arr1 = array1.concat().sort();
  const arr2 = array2.concat().sort();
  
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  
  return true;
}