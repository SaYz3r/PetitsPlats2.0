/**
 * Page principale - Gestion de l'affichage des recettes
 */

// Variables globales
let filterManager;

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

/**
 * Initialise la barre de recherche principale
 */
function initSearchBar() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.querySelector('.header__search-btn');
    
    if (!searchInput) return;

    // Recherche lors de la saisie (avec délai)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                filterManager.setSearchTerm(searchTerm);
            }
        }, 300);
    });

    // Recherche au clic sur le bouton
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                filterManager.setSearchTerm(searchTerm);
            }
        });
    }

    // Recherche à l'appui sur Entrée
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                filterManager.setSearchTerm(searchTerm);
            }
        }
    });
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
        
        // Initialiser le gestionnaire de filtres APRÈS l'affichage
        filterManager = new FilterManager();
        filterManager.init();
        
        // Initialiser la barre de recherche
        initSearchBar();
        
        console.log('=== PAGE INITIALISÉE AVEC SUCCÈS ===');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// Initialiser la page au chargement du DOM
init();