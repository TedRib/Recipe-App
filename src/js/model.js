import { async } from "regenerator-runtime"
import { API_URL, RESULTS_PER_PAGE, KEY } from "./config.js"
import { AJAX } from "./helper.js"

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
}

export const loadRecipe = async function (id) {
  //Get API data
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
    const { recipe } = data.data

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    }

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true
    else state.recipe.bookmarked = false
    console.log(state.recipe)
  } catch (err) {
    //Temp error handling
    console.error(`${err} Sheesh`)
    throw err
  }
}

const createRecipeObject = function (data) {
  const { recipe } = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  }
}

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
    state.recipe = createRecipeObject(data)
    console.log(data)

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      }
    })
    state.search.page = 1
    // console.log(state.search.results)
  } catch (err) {
    console.error(`${err} Sheesh`)
    throw err
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page

  const start = (page - 1) * state.search.resultsPerPage //0
  const end = page * state.search.resultsPerPage //9
  return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings

    //New qt = oldqt * newServings / oldserving --
  })
  state.recipe.servings = newServings
}
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe)

  //Mark current receipe is bookmarked

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
  persistBookmarks()
}

export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id)
  state.bookmarks.splice(index, 1)

  //Mark current recipe
  if (id === state.recipe.id) state.recipe.bookmarked = false
  persistBookmarks()
}

const init = function () {
  const storage = localStorage.getItem("bookmarks")
  if (storage) state.bookmarks = JSON.parse(storage)
}

init()

const clearBookmarks = function () {
  localStorage.clear("bookmarks")
}

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe))
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim())

        if (ingArr.length !== 3) throw new Error("Wrong Ingredient format")
        const [quantity, unit, description] = ingArr
        return { quantity: quantity ? +quantity : null, unit, description }
      })

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    console.log(recipe)
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
  } catch (err) {
    throw err
  }
}
