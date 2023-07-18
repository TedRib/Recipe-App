import * as model from "./model.js"
import recipeView from "./Views/recipeView.js"
import searchView from "./Views/searchView.js"
import resultsView from "./Views/resultsView.js"
import paginationView from "./Views/paginationView.js"

import "core-js/stable"
import "regenerator-runtime/runtime"

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept()
// }

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
    resultsView.renderSpinner()
    //Get Search query
    const query = searchView.getQuery()

    if (!query) return

    //load search
    await model.loadSearchResults(query)

    //render result
    // console.log(model.state.search.results)
    // resultsView.render(model.state.search.results)
    // console.log(model.getSearchResultsPage(1))
    resultsView.render(model.getSearchResultsPage())

    //render intial pagination buttions

    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  //Render new Results
  resultsView.render(model.getSearchResultsPage(goToPage))

  //render new pagination buttions

  paginationView.render(model.state.search)
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchresults)
  paginationView.addHandlerClick(controlPagination)
}
init()
