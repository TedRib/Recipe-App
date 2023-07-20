import * as model from "./model.js"
import { MODAL_CLOSE_SEC } from "./config.js"
import recipeView from "./Views/recipeView.js"
import searchView from "./Views/searchView.js"
import resultsView from "./Views/resultsView.js"
import paginationView from "./Views/paginationView.js"
import bookmarksView from "./Views/bookmarksView.js"
import addRecipeView from "./Views/addRecipeView.js"

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
    // update results view
    resultsView.update(model.getSearchResultsPage())

    // update bookmark
    bookmarksView.update(model.state.bookmarks)

    // load recipe
    await model.loadRecipe(id)

    //render recipe
    recipeView.render(model.state.recipe)

    //TEST
    // controlServings()
  } catch (err) {
    recipeView.renderError()
    console.error(err)
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

const controlServings = function (newServings = 4) {
  //update the recipe servings in the state
  model.updateServings(newServings)
  // Re render
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}
const controlAddBookmark = function () {
  // Add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  //2 Update recipe view
  console.log(model.state.recipe)
  recipeView.update(model.state.recipe)

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //Spinner loading
    addRecipeView.renderSpinner()

    //
    await model.uploadRecipe(newRecipe)

    //Render Recipe
    recipeView.render(model.state.recipe)

    //Sucess message
    addRecipeView.renderMessage()

    //render recipe
    bookmarksView.render(model.state.bookmarks)

    //Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`)

    //close form
    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error(err, "---------")
    addRecipeView.renderError(err.message)
  }
}
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchresults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
