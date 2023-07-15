import * as model from "./model.js"
import recipeView from "./Views/recipeView.js"

import "core-js/stable"
import "regenerator-runtime/runtime"

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    // load recipe
    await model.loadRecipe(id)
    const { recipe } = model.state

    //render recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    alert(err)
  }
}

;["hashchange", "load"].forEach((eV) =>
  window.addEventListener(eV, controlRecipes)
)
