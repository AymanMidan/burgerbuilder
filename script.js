const ingredientControls = document.querySelectorAll('.ingredient-control');
const resetButton = document.getElementById('resetBurger');
const validateButton = document.getElementById('validateBurger');
const burgerContainer = document.querySelector('.burger-ingredients');
const counter = document.getElementById('counter');
const totalPrice = document.getElementById('totalPrice');
const thankYouMessage = document.getElementById('thankYouMessage');

const MAX_SAME_INGREDIENT = 3;
let ingredientCount = 0;

const ingredientPrices = {
    onion: 0.5,
    lettuce: 0.4,
    tomato: 0.6,
    gherkins: 0.7,
    cheese: 1.0,
    ketchup: 0.3,
    'extra-patty': 2.5
};

let ingredientCounts = {};

ingredientControls.forEach(control => {
    const ingredient = control.getAttribute('data-ingredient');
    ingredientCounts[ingredient] = 0;
    
    const plusButton = control.querySelector('.plus');
    const minusButton = control.querySelector('.minus');
    
    minusButton.disabled = true;

    plusButton.addEventListener('click', () => addIngredient(ingredient, control));
    minusButton.addEventListener('click', () => removeIngredient(ingredient, control));
});

function addIngredient(ingredientType, control) {
    if (ingredientCounts[ingredientType] < MAX_SAME_INGREDIENT) {
        const ingredient = document.createElement('div');
        ingredient.classList.add('ingredient', ingredientType, 'animate__animated', 'animate__bounceIn');
        burgerContainer.appendChild(ingredient);
        
        ingredientCount++;
        ingredientCounts[ingredientType]++;
        
        updateControlButtons(control);
        updateCounter();
    }
}

function removeIngredient(ingredientType, control) {
    if (ingredientCounts[ingredientType] > 0) {
        const ingredients = burgerContainer.getElementsByClassName(ingredientType);
        if (ingredients.length > 0) {
            const lastIngredient = ingredients[ingredients.length - 1];
            lastIngredient.classList.remove('animate__bounceIn');
            lastIngredient.classList.add('animate__bounceOut');
            
            setTimeout(() => {
                lastIngredient.remove();
                ingredientCount--;
                ingredientCounts[ingredientType]--;
                updateControlButtons(control);
                updateCounter();
            }, 750);
        }
    }
}

function updateControlButtons(control) {
    const ingredient = control.getAttribute('data-ingredient');
    const count = ingredientCounts[ingredient];
    const plusButton = control.querySelector('.plus');
    const minusButton = control.querySelector('.minus');
    const countDisplay = control.querySelector('.ingredient-count');
    
    plusButton.disabled = count >= MAX_SAME_INGREDIENT;
    minusButton.disabled = count <= 0;
    countDisplay.textContent = `${count}/${MAX_SAME_INGREDIENT}`;
}

resetButton.addEventListener('click', () => {
    burgerContainer.innerHTML = '';
    ingredientCount = 0;
    
    ingredientControls.forEach(control => {
        const ingredient = control.getAttribute('data-ingredient');
        ingredientCounts[ingredient] = 0;
        updateControlButtons(control);
    });
    
    updateCounter();
    thankYouMessage.style.display = 'none';
});

validateButton.addEventListener('click', () => {
    if (ingredientCount > 0) {
        thankYouMessage.textContent = `Bon voyage gustatif !`;
        thankYouMessage.style.display = 'block';
        thankYouMessage.classList.remove('bounceIn');
        void thankYouMessage.offsetWidth;
        thankYouMessage.classList.add('bounceIn');
    }
});

function updateCounter() {
    let total = 0;
    for (const ingredient in ingredientCounts) {
        total += ingredientCounts[ingredient] * ingredientPrices[ingredient];
    }
    counter.textContent = `Ingrédients : ${ingredientCount}`;
    totalPrice.textContent = `Prix : ${total.toFixed(2)}€`;
}