/**
 * Page principale - Gestion de l'affichage des recettes
 */

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
    console.log(`${recipesData.length} recette(s) affichée(s)`);
}

/**
 * Fonction d'initialisation de la page
 */
async function init() {
    try {
        // Vérifier que les données sont chargées
        if (typeof recipes === 'undefined') {
            throw new Error('Les données des recettes ne sont pas chargées');
        }
        
        console.log('Initialisation de la page...');
        console.log(`${recipes.length} recettes chargées`);
        
        // Afficher toutes les recettes
        displayRecipes(recipes);
        
        console.log('Page initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// Initialiser la page au chargement du DOM
init();