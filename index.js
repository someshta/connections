var items = [
    {
        name: "Bin",
        category: "Parts of artist names we've seen together",
        color: "purple"
    },
    {
        name: "Glass",
        category: "Parts of artist names we've seen together",
        color: "purple"
    },
    {
        name: "Bridge",
        category: "Parts of artist names we've seen together",
        color: "purple"
    },
    {
        name: "Soul",
        category: "Parts of artist names we've seen together",
        color: "purple"
    },
    {
        name: "Mayonnaise",
        category: "Things one of us loves and the other...doesn't so much",
        color: "green"
    },
    {
        name: "IPA",
        category: "Things one of us loves and the other...doesn't so much",
        color: "green"
    },
    {
        name: "Hot yoga",
        category: "Things one of us loves and the other...doesn't so much",
        color: "green"
    },
    {
        name: "Mushroom",
        category: "Things one of us loves and the other...doesn't so much",
        color: "green"
    },
    {
        name: "Bawk!",
        category: "Locations of romantic firsts",
        color: "blue"
    },
    {
        name: "Jack's Urban Eats",
        category: "Locations of romantic firsts",
        color: "blue"
    },
    {
        name: "Hotel Shattuck Plaza",
        category: "Locations of romantic firsts",
        color: "blue"
    },
    {
        name: "The Nest",
        category: "Locations of romantic firsts",
        color: "blue"
    },
    {
        name: "Spain",
        category: "Potential vacation destinations",
        color: "yellow"
    },
    {
        name: "France",
        category: "Potential vacation destinations",
        color: "yellow"
    },
    {
        name: "Costa Rica",
        category: "Potential vacation destinations",
        color: "yellow"
    },
    {
        name: "Washington",
        category: "Potential vacation destinations",
        color: "yellow"
    }
];

let correctCategories = [
    {
        category: "Potential vacation destinations",
        color: "yellow",
        correctItems: "Costa Rica, France, Spain, Washington"
    },
    {
        category: "Things one of us loves and the other...doesn't so much",
        color: "green",
        correctItems: "IPA, Mayonnaise, Mushroom, Hot yoga"
    },
    {
        category: "Locations of romantic firsts",
        color: "blue",
        correctItems: "Bawk!, Jack's Urban Eats, Hotel Shattuck Plaza, The Nest"
    },
    {
        category: "Parts of artist names we've seen together",
        color: "purple",
        correctItems: "Bin, Bridge, Glass, Soul"
    }
];

let tileContainer = document.getElementById("tile-container");
let correctContainer = document.getElementById("correct");
let deselectBtn = document.getElementById("deselect");
let shuffleBtn = document.getElementById("shuffle");
let submitBtn = document.getElementById("submit");
let guessesRemaining = document.querySelectorAll(".dot");
let maxSelections = 4; // Maximum number of items that can be selected
let mistakesRemaining = 4;
let correctGuesses = 0;

//Limits selection to 4 boxes
const limitCheckboxes = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
            if (checkedCount > 0) {
                deselectBtn.disabled = false;
            }
            if (checkedCount === maxSelections) {
                submitBtn.disabled = false;
            }
            if (checkedCount < maxSelections) {
                submitBtn.disabled = true;
            }
            if (checkedCount > maxSelections) {
                checkbox.checked = false; // Undo the check
                displayPopUp(document.getElementById("limit"));
            }
        });
    });

};

//Handles deselecting all
const deselectAll = (tiles) => {
    tiles.forEach(tile => {
        if (tile.checked) {
            tile.checked = false;
        }
    })
    deselectBtn.disabled = true;
}

//Handles checking if correct
const checkConnection = (array) => {

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

    //Determine the message based on shared values
    if (maxShared === 4) {
        moveCorrect(array);
        deselectAll(array);
        correctGuesses++;
        console.log(correctGuesses);
        uiTiles = document.querySelectorAll("#tile-container .tile");
        submitBtn.disabled = true;
        if(correctGuesses == 4) {
            // Start the animation loop
            const love = setInterval(addHeart, 500);
            shuffleBtn.disabled = true;
        }
    } else if (maxShared === 3) {
        displayPopUp(document.getElementById("one-away"));
        subtractGuesses();
    } else {
        console.log("more than one away");
        tileShake(array);
        subtractGuesses();
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
        newWrapper.style.display = "none";

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
    selectedArr.forEach(selected => {
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

//Handles remaining guesses
const subtractGuesses = () => {
    mistakesRemaining--;
    let guessDiv = document.getElementById(`guess${4 - mistakesRemaining}`);
    console.log(mistakesRemaining);
    // Remove the div from the view
    guessDiv.remove();
    checkMistakesAndAlert(mistakesRemaining);
}

const checkMistakesAndAlert = (mistakesRemaining) => {
    if (mistakesRemaining === 0) {
        loseGame(document.getElementById("you-lose"));
    }
}

//Handles animation when guess is more than one away
const tileShake = (elements) => {
    // Define the side-to-side shake animation keyframes
    const keyframes = [
        { transform: 'translateX(0)' }, // Start state
        { transform: 'translateX(-3px)' }, // Move left
        { transform: 'translateX(3px)' }, // Move right
        { transform: 'translateX(-3px)' }, // Move left
        { transform: 'translateX(3px)' }, // Move right
        { transform: 'translateX(-3px)' }, // Move left
        { transform: 'translateX(3px)' }, // Move right
        { transform: 'translateX(0)' } // Return to the original state
    ];

    const options = {
        duration: 500, // Animation lasts 1 second (1000ms)
        easing: 'ease-in-out', // Smooth easing for a natural shake
        fill: 'forwards' // Ensures the element returns to its original state
    };

    // Loop through the array of elements and apply the animation
    elements.forEach((element) => {
        // Animate the current element
        const animation = element.animate(keyframes, options);

        // Check if the element has a next sibling and animate it as well
        if (element.nextSibling && element.nextSibling.nodeType === Node.ELEMENT_NODE) {
            const siblingAnimation = element.nextSibling.animate(keyframes, options);
        }
    });
}

//Handles one away pop-up
const displayPopUp = (element) => {
    // Check if the element exists
    if (!element) {
        console.error('Element not found!');
        return;
    }

    // Create an overlay div for the tint effect
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
    overlay.style.zIndex = '9998'; // Ensure it's below the element but above other content

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Change the display to 'block' to make the element visible
    element.style.display = 'block';
    element.style.zIndex = '9999'; // Ensure the element is above the overlay

    // Set a timeout to hide the element and remove the overlay after 3 seconds
    setTimeout(() => {
        element.style.display = 'none';
        document.body.removeChild(overlay); // Remove the overlay
    }, 1500);
}

//Handle losing
const loseGame = async (element) => {
    await displayPopUp(document.getElementById("you-lose"));
    tileContainer.style.display = "none";
    showLeftoverCategories();
    deselectBtn.disabled = true;
    shuffleBtn.disabled = true;
    submitBtn.disabled = true;
}

//Handles displaying leftover categories when you lose
const showLeftoverCategories = () => {
    let correctWrappers = document.querySelectorAll("#correct .correct-wrapper");

    correctWrappers.forEach(correctWrap => {
        console.dir(correctWrap);
        if (correctWrap.style.display = "none") {
            correctWrap.style.display = "block";
        }
    })
}

// Define a function that creates a heart element with random properties
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.width = `${Math.floor(Math.random() * 65) + 10}px`;
    heart.style.height = heart.style.width;
    heart.style.left = `${Math.floor(Math.random() * 100) + 1}%`;
    heart.style.background = `rgba(255, ${Math.floor(Math.random() * 25) + 100 - 25}, ${Math.floor(Math.random() * 25) + 100}, 1)`;
    const duration = Math.floor(Math.random() * 5) + 5;
    heart.style.animation = `love ${duration}s ease`;
    return heart;
  }
  
  // Get the container element where the hearts will be added
  const container = document.querySelector('.bg_heart');
  
  // Define a function that removes hearts that have gone off screen
  function removeHearts() {
    const hearts = container.querySelectorAll('.heart');
    hearts.forEach((heart) => {
      const top = parseFloat(getComputedStyle(heart).getPropertyValue('top'));
      const width = parseFloat(getComputedStyle(heart).getPropertyValue('width'));
      if (top <= -100 || width >= 150) {
        heart.remove();
      }
    });
  }
  
  // Define a function that repeatedly adds hearts to the container
  function addHeart() {
    const heart1 = createHeart();
    const heart2 = createHeart();
    container.appendChild(heart1);
    container.appendChild(heart2);
    setTimeout(removeHearts, 1000);
  }
  
  

