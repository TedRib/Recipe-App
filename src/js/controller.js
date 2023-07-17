import * as model from "./model.js"
import recipeView from "./Views/recipeView.js"
import searchView from "./Views/searchView.js"
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
    recipeView.renderError()
  }
}

const controlSearchresults = async function () {
  try {
    //Get Search query
    const query = searchView.getQuery()

    if (!query) return

    //load search
    await model.loadSearchResults(query)

    //render result
    console.log(model.state.search.results)
  } catch (err) {
    console.log(err)
  }
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchresults)
}
init()
