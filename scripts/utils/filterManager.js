/**
 * Gestionnaire de filtres - Gère tous les filtres actifs et le filtrage des recettes
 */

class FilterManager {
    constructor() {
        this.activeFilters = {
            ingredients: [],
            appliances: [],
            ustensils: []
        };
        this.filteredRecipes = [...recipes];
        this.tagsContainer = null;
        this.selectElements = {};
    }

    /**
     * Initialise le gestionnaire de filtres
     */
    init() {
        this.tagsContainer = document.getElementById('tags-container');
        
        // Récupérer les éléments select
        this.selectElements = {
            ingredients: document.getElementById('filter-ingredients'),
            appliances: document.getElementById('filter-appliances'),
            ustensils: document.getElementById('filter-ustensils')
        };

        // Vérifier que les selects existent
        if (!this.selectElements.ingredients || !this.selectElements.appliances || !this.selectElements.ustensils) {
            console.error('Les éléments select ne sont pas trouvés');
            return;
        }

        // Peupler les selects avec toutes les recettes
        this.updateAllSelects();

        // Attacher les événements
        this.attachEvents();
        
        console.log('FilterManager initialisé');
    }

    /**
     * Attache les événements aux selects
     */
    attachEvents() {
        Object.keys(this.selectElements).forEach(type => {
            this.selectElements[type].addEventListener('change', (e) => {
                const value = e.target.value;
                if (value) {
                    this.addFilter(type, value);
                    e.target.value = ''; // Reset le select
                }
            });
        });
    }

    /**
     * Ajoute un filtre
     */
    addFilter(type, value) {
        const filterArray = this.activeFilters[type];
        
        // Ne pas ajouter si déjà présent
        if (filterArray.includes(value)) return;
        
        filterArray.push(value);
        this.addTag(type, value);
        this.applyFilters();
    }

    /**
     * Retire un filtre
     */
    removeFilter(type, value) {
        const filterArray = this.activeFilters[type];
        const index = filterArray.indexOf(value);
        
        if (index > -1) {
            filterArray.splice(index, 1);
            this.applyFilters();
        }
    }

    /**
     * Ajoute un tag visuel
     */
    addTag(type, value) {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.setAttribute('data-type', type);
        tag.setAttribute('data-value', value);

        const tagText = document.createElement('span');
        tagText.classList.add('tag__text');
        tagText.textContent = value;

        const tagClose = document.createElement('button');
        tagClose.classList.add('tag__close');
        tagClose.innerHTML = '&times;';
        tagClose.setAttribute('aria-label', 'Supprimer le filtre');

        tagClose.addEventListener('click', () => {
            this.removeFilter(type, value);
            tag.remove();
        });

        tag.appendChild(tagText);
        tag.appendChild(tagClose);
        this.tagsContainer.appendChild(tag);
    }

    /**
     * Applique tous les filtres actifs
     */
    applyFilters() {
        let filtered = [...recipes];

        // Filtre par ingrédients
        if (this.activeFilters.ingredients.length > 0) {
            filtered = filtered.filter(recipe => {
                return this.activeFilters.ingredients.every(ingredient => {
                    return recipe.ingredients.some(ing =>
                        ing.ingredient.toLowerCase() === ingredient.toLowerCase()
                    );
                });
            });
        }

        // Filtre par appareils
        if (this.activeFilters.appliances.length > 0) {
            filtered = filtered.filter(recipe => {
                return this.activeFilters.appliances.some(appliance =>
                    recipe.appliance.toLowerCase() === appliance.toLowerCase()
                );
            });
        }

        // Filtre par ustensiles
        if (this.activeFilters.ustensils.length > 0) {
            filtered = filtered.filter(recipe => {
                return this.activeFilters.ustensils.every(ustensil => {
                    return recipe.ustensils.some(ust =>
                        ust.toLowerCase() === ustensil.toLowerCase()
                    );
                });
            });
        }

        this.filteredRecipes = filtered;
        this.updateDisplay();
    }

    /**
     * Met à jour l'affichage des recettes
     */
    updateDisplay() {
        // Afficher les recettes filtrées
        displayRecipes(this.filteredRecipes);

        // Mettre à jour tous les selects
        this.updateAllSelects();

        // Afficher un message si aucune recette
        const container = document.getElementById('recipes-container');
        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<p class="no-results">Aucune recette ne correspond à vos critères de recherche.</p>';
        }
    }

    /**
     * Met à jour tous les selects
     */
    updateAllSelects() {
        this.updateSelect('ingredients');
        this.updateSelect('appliances');
        this.updateSelect('ustensils');
    }

    /**
     * Met à jour un select spécifique
     */
    updateSelect(type) {
        const select = this.selectElements[type];
        if (!select) {
            console.error(`Select "${type}" non trouvé`);
            return;
        }

        const availableOptions = this.getAvailableOptions(type);
        
        // Sauvegarder le texte de la première option
        const placeholderText = select.options[0]?.text || type.charAt(0).toUpperCase() + type.slice(0, -1);
        
        // Vider le select
        select.innerHTML = '';
        
        // Recréer la première option (placeholder)
        const firstOption = document.createElement('option');
        firstOption.value = '';
        firstOption.textContent = placeholderText;
        select.appendChild(firstOption);

        // Ajouter les options disponibles (sauf celles déjà sélectionnées)
        availableOptions.forEach(option => {
            if (!this.activeFilters[type].includes(option)) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                select.appendChild(optionElement);
            }
        });
    }

    /**
     * Récupère les options disponibles pour un type de filtre
     */
    getAvailableOptions(type) {
        const optionsSet = new Set();

        // Utiliser les recettes filtrées
        const recipesToUse = this.filteredRecipes.length > 0 ? this.filteredRecipes : recipes;
        
        recipesToUse.forEach(recipe => {
            switch(type) {
                case 'ingredients':
                    recipe.ingredients.forEach(ing => {
                        optionsSet.add(ing.ingredient);
                    });
                    break;
                case 'appliances':
                    optionsSet.add(recipe.appliance);
                    break;
                case 'ustensils':
                    recipe.ustensils.forEach(ust => {
                        optionsSet.add(ust);
                    });
                    break;
            }
        });

        return Array.from(optionsSet).sort();
    }

    /**
     * Normalise une chaîne de caractères (enlève les accents, convertit en minuscules)
     * @param {string} str - Chaîne à normaliser
     * @returns {string} - Chaîne normalisée
     */
    normalizeString(str) {
        return str.toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .trim();
    }

    /**
     * Vérifie si le terme de recherche existe dans les filtres disponibles
     * @param {string} term - Terme à vérifier
     * @returns {object|null} - {type, value} si trouvé, null sinon
     */
    checkTermInFilters(term) {
        const termNormalized = this.normalizeString(term);
        
        // Récupérer toutes les options de tous les types depuis TOUTES les recettes
        const allIngredients = [];
        const allAppliances = [];
        const allUstensils = [];
        
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                if (!allIngredients.includes(ing.ingredient)) {
                    allIngredients.push(ing.ingredient);
                }
            });
            
            if (!allAppliances.includes(recipe.appliance)) {
                allAppliances.push(recipe.appliance);
            }
            
            recipe.ustensils.forEach(ust => {
                if (!allUstensils.includes(ust)) {
                    allUstensils.push(ust);
                }
            });
        });
        
        // Vérifier dans les ingrédients
        for (let ingredient of allIngredients) {
            if (this.normalizeString(ingredient) === termNormalized) {
                return { type: 'ingredients', value: ingredient };
            }
        }
        
        // Vérifier dans les appareils
        for (let appliance of allAppliances) {
            if (this.normalizeString(appliance) === termNormalized) {
                return { type: 'appliances', value: appliance };
            }
        }
        
        // Vérifier dans les ustensiles
        for (let ustensil of allUstensils) {
            if (this.normalizeString(ustensil) === termNormalized) {
                return { type: 'ustensils', value: ustensil };
            }
        }
        
        return null;
    }

    /**
     * Met à jour la recherche principale
     */
    setSearchTerm(term) {
        // Si le terme est vide, ne rien faire
        if (!term || term.length === 0) {
            return;
        }

        // Si le terme est trop court, ne rien faire
        if (term.length < 3) {
            return;
        }

        // Vérifier si le terme existe dans les filtres
        const filterMatch = this.checkTermInFilters(term);
        
        if (filterMatch) {
            // Ajouter comme filtre normal
            this.addFilter(filterMatch.type, filterMatch.value);
        } else {
            // Afficher un message d'erreur ou ne rien faire
            console.log(`Le terme "${term}" ne correspond à aucun ingrédient, appareil ou ustensile`);
            
            // Optionnel : Afficher un message à l'utilisateur
            this.showSearchError(term);
        }
    }

    /**
     * Affiche un message d'erreur temporaire
     */
    showSearchError(term) {
        // Chercher s'il y a déjà un message d'erreur
        let errorMsg = document.querySelector('.search-error');
        
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.classList.add('search-error');
            this.tagsContainer.appendChild(errorMsg);
        }
        
        errorMsg.textContent = `"${term}" ne correspond à aucun ingrédient, appareil ou ustensile`;
        errorMsg.style.display = 'block';
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 3000);
    }
}