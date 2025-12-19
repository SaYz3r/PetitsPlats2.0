import { recipeCardTemplate } from "/scripts/templates/recipeCard.js";

/**
 * Affiche toutes les recettes dans le container
 * @param {Array} recipesData - Tableau des recettes à afficher
 */
function displayRecipes(recipesData) {
    const recipesContainer = document.getElementById('recipes-container');
    
    // Vider le container avant d'afficher
    recipesContainer.innerHTML = '';
    
    // Créer et ajouter chaque carte de recette
    recipesData.forEach(recipe => {
        const recipeCard = recipeCardTemplate(recipe);
        const cardDOM = recipeCard.getRecipeCardDOM();
        recipesContainer.appendChild(cardDOM);
    });
    
    // Afficher le nombre de recettes
    updateRecipeCount(recipesData.length);
}

/**
 * Met à jour le compteur de recettes
 */
function updateRecipeCount(count) {
    const countElement = document.getElementById('recipe-count');
    if (countElement) {
        countElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
    }
}

export {displayRecipes};