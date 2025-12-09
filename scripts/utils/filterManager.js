/**
 * Gestionnaire de filtres - Gère tous les filtres actifs et le filtrage des recettes
 */

class FilterManager {
    constructor() {
        this.activeFilters = {
            ingredients: [],
            appliances: [],
            ustensils: [],
            search: ''
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

        // Filtre par recherche principale
        if (this.activeFilters.search) {
            const searchTerm = this.activeFilters.search.toLowerCase();
            filtered = filtered.filter(recipe => {
                return recipe.name.toLowerCase().includes(searchTerm) ||
                       recipe.description.toLowerCase().includes(searchTerm) ||
                       recipe.ingredients.some(ing => 
                           ing.ingredient.toLowerCase().includes(searchTerm)
                       );
            });
        }

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
        
        console.log(`Mise à jour du select "${type}" avec ${availableOptions.length} options`);
        
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

        const options = Array.from(optionsSet).sort();
        console.log(`Options disponibles pour ${type}:`, options);
        return options;
    }

    /**
     * Met à jour la recherche principale
     */
    setSearchTerm(term) {
        this.activeFilters.search = term;
        this.applyFilters();
    }
}