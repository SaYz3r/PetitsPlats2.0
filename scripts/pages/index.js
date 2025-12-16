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

    // Créer le bouton de suppression (croix)
    const clearBtn = document.createElement('button');
    clearBtn.classList.add('header__search-clear');
    clearBtn.innerHTML = '&times;';
    clearBtn.setAttribute('aria-label', 'Effacer la recherche');
    clearBtn.style.display = 'none'; // Caché par défaut
    
    // Insérer la croix avant la loupe
    searchBtn.parentNode.insertBefore(clearBtn, searchBtn);

    // Sauvegarder le placeholder original
    const originalPlaceholder = searchInput.placeholder;

    // Vider le placeholder au focus
    searchInput.addEventListener('focus', () => {
        searchInput.placeholder = '';
    });

    // Restaurer le placeholder si vide au blur
    searchInput.addEventListener('blur', () => {
        if (searchInput.value.trim() === '') {
            searchInput.placeholder = originalPlaceholder;
        }
    });

    // Recherche en temps réel lors de la saisie
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        
        // Afficher/masquer le bouton de suppression
        if (searchTerm.length > 0) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Minimum 3 caractères pour déclencher la recherche
            if (searchTerm.length >= 3) {
                filterManager.setMainSearch(searchTerm);
            } else if (searchTerm.length === 0) {
                // Si vide, réinitialiser
                filterManager.setMainSearch('');
            }
        }, 300); // Délai de 300ms après la dernière frappe
    });

    // Effacer la recherche au clic sur la croix
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.placeholder = originalPlaceholder;
        filterManager.setMainSearch('');
        searchInput.focus(); // Garder le focus sur l'input
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