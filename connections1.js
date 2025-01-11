var items = [
    {
        name: "rice",
        category: "food",    
        color: "blue"
    },
    {
        name: "bean", 
        category: "food",     
        color: "blue"
    },
    {
        name: "chicken",  
        category: "food",    
        color: "blue"
    },
    {
        name: "carrot",  
        category: "food",    
        color: "blue"
    },
    {
        name: "train", 
        category: "transportation",     
        color: "green"
    },
    {
        name: "car",   
        category: "transportation",   
        color: "green"
    },
    {
        name: "bicycle", 
        category: "transportation",     
        color: "green"
    },
    {
        name: "rollerblades",  
        category: "transportation",    
        color: "green"
    },
    {
        name: "blanket",
        category: "warmth",      
        color: "purple"
    },
    {
        name: "socks",
        category: "warmth",     
        color: "purple"
    },
    {
        name: "sweatshirt", 
        category: "warmth",    
        color: "purple"
    },
    {
        name: "fireplace", 
        category: "warmth",    
        color: "purple"
    },
    {
        name: "lavendar",
        category: "plant",     
        color: "yellow"
    },
    {
        name: "pothos",  
        category: "plant",  
        color: "yellow"
    },
    {
        name: "aloe vera",
        category: "plant",    
        color: "yellow"
    },
    {
        name: "monsterra",
        category: "plant",    
        color: "yellow"
    }
];

let correctCategories = [
    {
        category: "food",
        color: "blue",
        correctItems: "chicken, rice, carrot, bean"
    },
    {
        category: "transportation",
        color: "green",
        correctItems: "train, bicycle, car, roller blades"
    },
    {
        category: "plant",
        color: "yellow",
        correctItems: "monsterra, lavendar, aloe vera, pothos"
    },
    {
        category: "warmth",
        color: "purple",
        correctItems: "fireplace, blanket, sweatshirt, socks"
    }
];

//Dom elements
let tileContainer = document.getElementById("tile-container");
let correctContainer = document.getElementById("correct");
let deselectBtn = document.getElementById("deselect");
let shuffleBtn = document.getElementById("shuffle");
let submitBtn = document.getElementById("submit");

let maxSelections = 4; // Maximum number of items that can be selected
let correctTiles = [];

//Limits selection to 4 boxes
const limitCheckboxes = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
  
        if (checkedCount > maxSelections) {
          checkbox.checked = false; // Undo the check
          alert(`You can only select up to ${maxSelections} options.`);
        }
      });
    });
};

//Handles deselecting all
const deselectAll = (tiles) => {
    tiles.forEach (tile => {        
        if(tile.checked) {
            tile.checked = false;
        }
    })
}

//Handles checking if correct
const checkConnection = (array) => {
    if (array.length !== 4) {
        alert("You must select 4 tiles");
        return;
    }

    // Count occurrences of each attribute value
    const count = {};
    for (const item of array) {
        const value = item.getAttribute("data-category");
        if (value !== undefined) {
            count[value] = (count[value] || 0) + 1;
        }
    }

    // Find the highest count
    const maxShared = Math.max(...Object.values(count));

    // Determine the message based on shared values
    if (maxShared === 4) {
        alert("Nice!");
        moveCorrect(array);
        deselectAll(array);
        uiTiles = document.querySelectorAll("#tile-container .tile");
    } else if (maxShared === 3) {
        alert("One away!");
    } else {
        alert("Try again");
    }
}

const createCheckboxes = (items, tileContainer) => {
  
    // Loop through the items array
    items.forEach(item => {
      // Create a checkbox input element
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `checkbox-${item.name}`;
      checkbox.name = item.name;
      checkbox.value = item.name;
      checkbox.dataset.category = item.category;
  
      // Create a label for the checkbox
      const label = document.createElement('label');
      label.htmlFor = `checkbox-${item.name}`;
      label.textContent = item.name;
  
      // Create a wrapper div for better styling or grouping
      const wrapper = document.createElement('div');
      wrapper.classList.add('tile');
      if (item.category) {
        wrapper.dataset.category = item.category; // Add category as a data attribute
      }
  
      // Append the checkbox and label to the wrapper
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
  
      // Append the wrapper to the container
      tileContainer.appendChild(wrapper);
    });
}

const createCorrectWrappers = (wrappers, correctContainer) => {
    
    wrappers.forEach(wrapper => {
        const newWrapper = document.createElement("div");
        const newWrapperText = document.createElement("p");
        const newWrapperHeading = document.createElement("h2");
        newWrapperHeading.innerText = wrapper.category;
        newWrapperText.innerText = wrapper.correctItems;
        newWrapper.appendChild(newWrapperHeading);
        newWrapper.appendChild(newWrapperText);
        newWrapper.classList.add("correct-wrapper", wrapper.color);
        newWrapper.dataset.category = wrapper.category;

        correctContainer.appendChild(newWrapper);
    })
}
  
createCheckboxes(items, tileContainer);
createCorrectWrappers(correctCategories, correctContainer);
let uiTiles = document.querySelectorAll("#tile-container .tile");

//Handles shuffling all
const shuffle = () => {
    const tileArray = Array.from(uiTiles);
  
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    shuffleArray(tileArray);
  
    tileArray.forEach(tile => {
      tile.parentNode.appendChild(tile);
    });
}

shuffle();
limitCheckboxes();

//Handles moving correct tiles into new container
const moveCorrect = (selectedArr) => {
    selectedArr.forEach (selected => {
        let selectedCategory = selected.parentNode.getAttribute("data-category");
        let targetContainer = document.querySelector(`#correct [data-category="${selectedCategory}"]`);
        targetContainer.style.display = "block";
        targetContainer.parentNode.appendChild(targetContainer);
        selected.parentNode.style.display = "none";
    })
}

//Handle button calls
deselectBtn.addEventListener("click", () => deselectAll(document.querySelectorAll('input[type="checkbox"]:checked')));
shuffleBtn.addEventListener("click", () => shuffle(uiTiles));
submitBtn.addEventListener("click", () => checkConnection(document.querySelectorAll('input[type="checkbox"]:checked')))
  