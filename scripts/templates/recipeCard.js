function recipeCardTemplate(recipe) {
    const { id, image, name, time, description, ingredients } = recipe;
    const picture = `assets/images/plats/${image}`;

    function getRecipeCardDOM() {
        const card = document.createElement('article');
        card.classList.add('card');

        // Image et temps
        const cardImage = document.createElement('div');
        cardImage.classList.add('card__image');

        const img = document.createElement('img');
        img.setAttribute('src', picture);
        img.setAttribute('alt', name);

        const timeElement = document.createElement('span');
        timeElement.classList.add('card__time');
        timeElement.textContent = `${time}min`;

        cardImage.appendChild(img);
        cardImage.appendChild(timeElement);

        // Contenu
        const cardContent = document.createElement('div');
        cardContent.classList.add('card__content');

        // Titre
        const title = document.createElement('h3');
        title.classList.add('card__title');
        title.textContent = name;

        // Section recette
        const recipeSection = document.createElement('div');
        recipeSection.classList.add('card__section');

        const recipeSubtitle = document.createElement('h4');
        recipeSubtitle.classList.add('card__subtitle');
        recipeSubtitle.textContent = 'RECETTE';

        const recipeDescription = document.createElement('p');
        recipeDescription.classList.add('card__description');
        recipeDescription.textContent = description;

        recipeSection.appendChild(recipeSubtitle);
        recipeSection.appendChild(recipeDescription);

        // Section ingrédients
        const ingredientsSection = document.createElement('div');
        ingredientsSection.classList.add('card__section');

        const ingredientsSubtitle = document.createElement('h4');
        ingredientsSubtitle.classList.add('card__subtitle');
        ingredientsSubtitle.textContent = 'INGRÉDIENTS';

        const ingredientsList = document.createElement('div');
        ingredientsList.classList.add('card__ingredients');

        ingredients.forEach(ing => {
            const ingredientItem = document.createElement('div');
            ingredientItem.classList.add('card__ingredient-item');

            const ingredientName = document.createElement('div');
            ingredientName.classList.add('card__ingredient-name');
            ingredientName.textContent = ing.ingredient;

            const ingredientQuantity = document.createElement('div');
            ingredientQuantity.classList.add('card__ingredient-quantity');
            const quantity = ing.quantity || '';
            const unit = ing.unit || '';
            ingredientQuantity.textContent = `${quantity}${unit}`;

            ingredientItem.appendChild(ingredientName);
            ingredientItem.appendChild(ingredientQuantity);
            ingredientsList.appendChild(ingredientItem);
        });

        ingredientsSection.appendChild(ingredientsSubtitle);
        ingredientsSection.appendChild(ingredientsList);

        // Assemblage
        cardContent.appendChild(title);
        cardContent.appendChild(recipeSection);
        cardContent.appendChild(ingredientsSection);

        card.appendChild(cardImage);
        card.appendChild(cardContent);

        return card;
    }

    return { getRecipeCardDOM };
}