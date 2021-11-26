/** Class for Important Description H5P widget */
export default class ImportantDescription {

  /**
   * @constructor
   * @param {object} parent Parent element in semantics.
   * @param {object} field Semantics field properties.
   * @param {object} params Parameters entered in editor form.
   * @param {function} setValue Callback to set parameters.
   */
  constructor(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;

    // Let parent handle ready callbacks of children
    this.passReadies = true;

    // DOM
    this.$container = H5P.jQuery('<div>', {
      class: 'h5peditor-important-description'
    });

    // Changes
    this.changes = [];

    // Instantiate original field (or create your own and call setValue)
    this.fieldInstance = new H5PEditor.widgets[this.field.type](this.parent, this.field, this.params, this.setValue);
    this.fieldInstance.appendTo(this.$container);

    // Relay changes
    this.fieldInstance.changes.push(() => {
      this.handleFieldChange();
    });

    // Build storage key
    const librarySelector = H5PEditor.findLibraryAncestor(this.parent);
    if (librarySelector.currentLibrary !== undefined) {
      const library = librarySelector.currentLibrary.split(' ')[0];
      const identifier = `${library}-${this.field.name}`.replace(/\.|_/g, '-');
      this.storageKey = `${identifier}-important-description-open`;
    }

    this.dictionary = this.createDictionary(
      ['importantInstructions', 'hideImportantInstructions', 'example',
        'showImportantInstructions', 'hide']
    );

    // Find reference node for adding important descriptions
    const reference = this.findReference(this.$container.get(0));

    if (reference) {
      // Add fields
      this.instructions = this.buildInstructions(this.field.importantDescription);
      if (this.instructions) {
        reference.parentNode.insertBefore(this.instructions, reference);
      }

      this.showInstructionsButton = this.buildShowInstructionsButton(this.field.importantDescription);
      if (this.showInstructionsButton) {
        reference.parentNode.insertBefore(this.showInstructionsButton, reference);
      }

      // Set initial state
      H5PEditor.storage.get(this.storageKey, value => {
        if (value === undefined || value === true) {
          this.$container.get(0).classList.add('instructions-visible');
        }
      });
    }

    // Errors
    this.$errors = this.$container.find('.h5p-errors');
  }

  /**
   * Find reference node to insert description before.
   * @param {HTMLElement} container Container to look in.
   * @return {HTMLElement|null} Reference node.
   */
  findReference(container) {
    let reference =
      container.querySelector('.h5peditor-field-description') ||
      container.querySelector('.h5peditor-label-wrapper');
    if (reference) {
      reference = reference.nextSibling;
    }
    else {
      reference = container.get(0).querySelector('.field').firstChild;
    }

    return reference;
  }

  /**
   * Build instructions DOM.
   * @param {object} importantDescription Params from semantics.
   * @return {HTMLElement} Instructions DOM.
   */
  buildInstructions(importantDescription = {}) {
    if (!importantDescription.description && !importantDescription.example) {
      return;
    }

    const instructions = document.createElement('div');
    instructions.classList.add('instructions');

    // Header
    const header = document.createElement('div');
    header.classList.add('header');
    instructions.appendChild(header);

    // Title
    const title = document.createElement('div');
    title.classList.add('title');
    title.innerText = this.dictionary['importantInstructions'];
    header.appendChild(title);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.setAttribute('aria-label', this.dictionary['hideImportantInstructions']);
    closeButton.innerText = this.dictionary['hide'];
    closeButton.addEventListener('click', () => {
      this.handleCloseInstructions();
    });
    header.appendChild(closeButton);

    // Body
    const body = document.createElement('div');
    body.classList.add('body');
    instructions.appendChild(body);

    // Important description section
    if (importantDescription.description) {
      const description = document.createElement('div');
      description.classList.add('description');
      description.innerHTML = importantDescription.description;
      body.appendChild(description);
    }

    // Example section
    if (importantDescription.example) {
      const example = document.createElement('div');
      example.classList.add('example');

      const title = document.createElement('div');
      title.classList.add('example-title');
      title.innerText = this.dictionary['example'];
      example.appendChild(title);

      const text = document.createElement('div');
      text.classList.add('example-text');
      text.innerHTML = importantDescription.example;
      example.appendChild(text);
      body.appendChild(example);
    }

    return instructions;
  }

  /**
   * Build DOM for "Show instructions button".
   * @param {object} importantDescription Params from semantics.
   * @return {HTMLElement} DOM for "Show instructions button".
   */
  buildShowInstructionsButton(importantDescription = {}) {
    const showInstuctionsButtonWrapper = document.createElement('div');
    showInstuctionsButtonWrapper.classList.add('show-instructions-button-wrapper');

    const showInstructionsButton = document.createElement('button');
    showInstructionsButton.classList.add('show-instructions-button');
    showInstructionsButton.innerText = this.dictionary['showImportantInstructions'];
    showInstructionsButton.addEventListener('click', () => {
      this.handleOpenInstructions();
    });
    showInstuctionsButtonWrapper.appendChild(showInstructionsButton);

    if (importantDescription.floatingButton) {
      showInstructionsButton.classList.add('floating');
    }

    return showInstuctionsButtonWrapper;
  }

  /**
   * Handle open instructions.
   */
  handleOpenInstructions() {
    this.$container.get(0).classList.add('instructions-visible');
    H5PEditor.storage.set(this.storageKey, true);
  }

  /**
   * Handle close instructions.
   */
  handleCloseInstructions() {
    this.$container.get(0).classList.remove('instructions-visible');
    H5PEditor.storage.set(this.storageKey, false);
  }

  /**
   * Handle change of field.
   */
  handleFieldChange() {
    this.params = this.fieldInstance.params;
    this.changes.forEach(change => {
      change(this.params);
    });
  }

  /**
   * Create dictionary.
   * Should use the terms used in H5P core, but have a safety measure for
   * changes to the keys.
   * @param {string[]} words Keys of words to be translated.
   * @return {object} Lookup table for translations.
   */
  createDictionary(words = []) {
    const dictionary = {};

    words.forEach(word => {
      if (H5PEditor.t('core', word).indexOf(`Missing translation for ${word}`) !== 0) {
        dictionary[word] = H5PEditor.t('core', word);
      }
      else {
        dictionary[word] = H5PEditor.t('H5PEditor.ImportantDescription', word);
      }
    });

    return dictionary;
  }

  /**
   * Append field to wrapper. Invoked by H5P core.
   * @param {H5P.jQuery} $wrapper Wrapper.
   */
  appendTo($wrapper) {
    this.$container.appendTo($wrapper);
  }

  /**
   * Validate current values. Invoked by H5P core.
   * @return {boolean} True, if current value is valid, else false.
   */
  validate() {
    return this.fieldInstance.validate();
  }

  /**
   * Remove self. Invoked by H5P core.
   */
  remove() {
    this.$container.remove();
  }
}
