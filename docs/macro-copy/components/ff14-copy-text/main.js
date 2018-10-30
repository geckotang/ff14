customElements.define('ff14-copy-text',
  class extends HTMLElement {

    static get observedAttributes() {
      return ['value'];
    }

    get value() {
      return this.getAttribute('value') || '';
    }

    set value(value) {
      this.setAttribute('value', value);
      if (this.inputText) {
        this.inputText.value = value;
      }
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._render();
    }

    connectedCallback(){
      const root = this.shadowRoot;
      this.copyButton = root.querySelector('#execCopy');
      this.inputText = root.querySelector('#text');
      this._boundOnButtonClick = this._onButtonClick.bind(this);
      this.copyButton.addEventListener('click', this._boundOnButtonClick);
    }

    disconnectedCallback() {
      this.copyButton.removeEventListener('click', this._boundOnButtonClick);
    }

    _onButtonClick() {
      this.inputText.select();
      const success = document.execCommand('copy');
      if (success) {
        this._highlighted(this.inputText);
        this.copyButton.focus();
        this.dispatchEvent(new CustomEvent('copied'))
      }
    }

    _highlighted(el) {
      if (!el) {
        return;
      }
      const modifier = '-highlighted'
      el.classList.add(modifier);
      el.addEventListener('animationend', __onAnimationEnd, false);
      function __onAnimationEnd () {
        el.classList.remove(modifier);
        el.removeEventListener('animationend', __onAnimationEnd);
      }
    }

    _render() {
      const style = `
        <style>
          :host {
            display: flex;
          }
          input {
            flex: 1 1 auto;
            box-sizing: border-box;
            min-height: 45px;
            padding-left: 15px;
            padding-right: 15px;
            border-radius: 4px;
            border: 2px solid #ccc;
            font: inherit;
          }
          input.-highlighted {
            animation: 0.7s highlighted ease-out;
          }
          @keyframes highlighted {
            to {
              border-color: #00BCD4;
              background-color: #d9f6ff;
            }
          }
          button {
            box-sizing: border-box;
            min-height: 40px;
            margin-left: 20px;
            border-radius: 4px;
            border: 0;
            background-color: #0c1b34;
            color: #fff;
            font: inherit;
            transition: 0.1s ease-out;
          }
          button:hover {
            background-color: #1b59b3;
            cursor: pointer;
          }
          button:focus {
            background-color: #00BCD4;
          }
        </style>
      `;
      const text = this.getAttribute('text') || 'コピー';
      const html = `
        <input id="text" type="text" value="${ this.value }" tabindex="-1">
        <button id="execCopy">${ text }</button>
      `;
      this.shadowRoot.innerHTML = `
        ${ style }
        ${ html }
      `;
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'value' && oldVal !== newVal ) {
        if (!this.inputText) {
          return;
        }
        this.inputText.value = newVal;
      }
    }

  }
);

