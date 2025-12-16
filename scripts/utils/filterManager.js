/**
 * Gestionnaire de filtres - Gère tous les filtres actifs et le filtrage des recettes
 */

class FilterManager {
    constructor() {
        this.activeFilters = {
            mainSearch: '',
            ingredients: [],
            appliances: [],
            ustensils: []
        };
        this.filteredRecipes = [...recipes];
        this.tagsContainer = null;
        this.dropdowns = {};
        this.searchInputs = {};
    }

    /**
     * Initialise le gestionnaire de filtres
     */
    init() {
        this.tagsContainer = document.getElementById('tags-container');
        
        // Initialiser les 3 dropdowns
        ['ingredients', 'appliances', 'ustensils'].forEach(type => {
            this.initDropdown(type);
        });
        
        // Fermer les dropdowns au clic extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-wrapper')) {
                this.closeAllDropdowns();
            }
        });
        
        console.log('FilterManager initialisé');
    }

    /**
     * Initialise un dropdown spécifique
     */
    initDropdown(type) {
        const header = document.getElementById(`filter-header-${type}`);
        const content = header.nextElementSibling;
        const searchInput = content.querySelector('.filter-dropdown__input');
        const list = document.getElementById(`list-${type}`);
        const tagsContainer = document.getElementById(`tags-${type}`);
        
        this.dropdowns[type] = { header, content, list, tagsContainer };
        this.searchInputs[type] = searchInput;
        
        // Toggle dropdown au clic sur le header
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(type);
        });
        
        // Recherche interne dans le dropdown
        searchInput.addEventListener('input', (e) => {
            this.filterDropdownOptions(type, e.target.value);
        });
        
        // Empêcher la fermeture au clic dans le dropdown
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Peupler la liste
        this.updateDropdownList(type);
    }

    /**
     * Toggle un dropdown (ouvrir/fermer)
     */
    toggleDropdown(type) {
        const { header, content } = this.dropdowns[type];
        const isOpen = content.style.display === 'block';
        
        // Fermer tous les autres dropdowns
        this.closeAllDropdowns();
        
        if (!isOpen) {
            content.style.display = 'block';
            header.classList.add('active');
            this.searchInputs[type].focus();
        }
    }

    /**
     * Ferme tous les dropdowns
     */
    closeAllDropdowns() {
        Object.keys(this.dropdowns).forEach(type => {
            const { header, content } = this.dropdowns[type];
            content.style.display = 'none';
            header.classList.remove('active');
            this.searchInputs[type].value = '';
            this.updateDropdownList(type);
        });
    }

    /**
     * Filtre les options du dropdown selon la recherche interne
     */
    filterDropdownOptions(type, searchTerm) {
        const { list } = this.dropdowns[type];
        const items = list.querySelectorAll('.filter-dropdown__item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            item.style.display = matches ? 'block' : 'none';
        });
    }

    /**
     * Met à jour la liste d'un dropdown
     */
    updateDropdownList(type) {
        const { list, tagsContainer } = this.dropdowns[type];
        const availableOptions = this.getAvailableOptions(type);
        
        // Vider la liste
        list.innerHTML = '';
        
        // Mettre à jour les tags dans le dropdown
        this.updateDropdownTags(type);
        
        // Ajouter les options disponibles (SAUF celles déjà sélectionnées)
        availableOptions.forEach(option => {
            // Ne pas afficher si déjà sélectionné
            if (this.activeFilters[type].includes(option)) {
                return;
            }
            
            const item = document.createElement('div');
            item.classList.add('filter-dropdown__item');
            item.textContent = option;
            
            item.addEventListener('click', () => {
                this.addFilter(type, option);
            });
            
            list.appendChild(item);
        });
    }

    /**
     * Met à jour les tags dans le dropdown
     */
    updateDropdownTags(type) {
        const { tagsContainer } = this.dropdowns[type];
        tagsContainer.innerHTML = '';
        
        this.activeFilters[type].forEach(value => {
            const tag = document.createElement('div');
            tag.classList.add('filter-dropdown__tag');
            
            const tagText = document.createElement('span');
            tagText.textContent = value;
            
            const tagClose = document.createElement('span');
            tagClose.classList.add('filter-dropdown__tag-close');
            tagClose.innerHTML = '&times;';
            
            tagClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFilter(type, value);
            });
            
            tag.appendChild(tagText);
            tag.appendChild(tagClose);
            tagsContainer.appendChild(tag);
        });
    }

    /**
     * Définit la recherche principale
     */
    setMainSearch(searchTerm) {
        this.activeFilters.mainSearch = searchTerm;
        this.applyFilters();
    }

    /**
     * Ajoute un filtre
     */
    addFilter(type, value) {
        const filterArray = this.activeFilters[type];
        
        if (filterArray.includes(value)) return;
        
        filterArray.push(value);
        this.addTagToGlobal(type, value);
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
            this.removeTagFromGlobal(type, value);
            this.applyFilters();
        }
    }

    /**
     * Ajoute un tag dans la zone globale
     */
    addTagToGlobal(type, value) {
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
        });

        tag.appendChild(tagText);
        tag.appendChild(tagClose);
        this.tagsContainer.appendChild(tag);
    }

    /**
     * Retire un tag de la zone globale
     */
    removeTagFromGlobal(type, value) {
        const tag = this.tagsContainer.querySelector(`[data-type="${type}"][data-value="${value}"]`);
        if (tag) {
            tag.remove();
        }
    }

    /**
     * Applique tous les filtres actifs
     */
    applyFilters() {
        let filtered = [...recipes];

        // Filtre par recherche principale
        if (this.activeFilters.mainSearch && this.activeFilters.mainSearch.length >= 3) {
            const searchTerm = this.activeFilters.mainSearch.toLowerCase();
            
            filtered = filtered.filter(recipe => {
                const inTitle = recipe.name.toLowerCase().includes(searchTerm);
                const inDescription = recipe.description.toLowerCase().includes(searchTerm);
                const inIngredients = recipe.ingredients.some(ing => 
                    ing.ingredient.toLowerCase().includes(searchTerm)
                );
                
                return inTitle || inDescription || inIngredients;
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

        // Mettre à jour tous les dropdowns
        Object.keys(this.dropdowns).forEach(type => {
            this.updateDropdownList(type);
        });

        const container = document.getElementById('recipes-container');
        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<p class="no-results">Aucune recette ne correspond à vos critères de recherche.</p>';
        }
    }

    /**
     * Récupère les options disponibles pour un type
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
}