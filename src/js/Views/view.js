import { mark } from "regenerator-runtime"
import icons from "url:../../img/icons.svg"

export default class View {
  _data
  /**
   * Render received object to the DOM
   * @param {Object || Object[]} data The data to be redered
   * @param {boolean} [render= true] if false create markup string instead of rendering to DOM
   * @param {undefined |string} A markup string is returned if render is false
   * @returns
   * @this {Object} View instance
   * @author Ted Ribiro
   * @todo Finish some implementations
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()

    this._data = data
    const markup = this._generateMarkup()
    if (!render) return markup
    this._clear()
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError()

    this._data = data
    const newMarkup = this._generateMarkup()

    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDOM.querySelectorAll("*"))
    // console.log(newElements)
    const curElements = Array.from(this._parentElement.querySelectorAll("*"))

    // console.log(curElements)
    // console.log(newElements)

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]
      // console.log(curEl, newEl.isEqualNode(curEl))

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent
      }

      //update change atrributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        )
      }
    })
  }

  _clear() {
    this._parentElement.innerHTML = ""
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`
    this._clear()
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }
}
