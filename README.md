H5P Editor Important Description
==========

Recreates functionality from H5P core that there is tied to HTML widgets only.
Should work for a large variety of field types (all but lists, fingers crossed).

Can be added by setting a field's `widget` property to `"importantDescription"`.

Expects an `importantDescription` property with an object as value. That value
can hold the properties:
- `"description"` (string): HTML for the description, same as for H5P core.
- `"example"` (string): HTML for an example, same as for H5P core.
- `"floatingButton"` (boolean): True if the button for showing the instructions
should float next to the next field. Will take a separate line be default.
- `"l10n"` (object): Holding custom translations for fields that should override
the original value used in H5P core:
  - `"example"` (string): Subtitle for example
  - `"hide"` (string): Label for "Hide" button
  - `"hideImportantInstructions"` (string): ARIA label for "Hide" button
  - `"importantInstructions"` (string): Title for field when open
  - `"showImportantInstructions"` Label for "Show" button

Will try to place the instructions/the button for showing the instructions
after the description. If no description is available, will try under the label.
If no label is available, will put it before the first field.

## Example for semantics.json
```
  {
    "name": "someField",
    "type": "text",
    "description": "Text field that should get the widget attached to.",
    "widget": "importantDescription",
    "importantDescription": {
      "description": "Some important description",
      "example": "Some example including a list: <ul><li>A</li><li>B</li></ul>",
      "floatingButton": false,
      "l10n": {
        "example": "Here's an example:",
        "hide": "Hide",
        "hideImportantInstructions": "Hide me",
        "importantInstructions": "I am some title",
        "showImportantInstructions": "Show me"
      }
    }
  }
```

## Getting started
Clone this repository with git and check out the branch that you are interested
in (or choose the branch first and then download the archive, but learning
how to use git really makes sense).

Change to the repository directory and run
```bash
npm install
```

to install required modules. Afterwards, you can build the project using
```bash
npm run build
```

or, if you want to let everything be built continuously while you are making
changes to the code, run
```bash
npm run watch
```
Before putting the code in production, you should always run `npm run build`.

The build process will transpile ES6 to earlier versions in order to improve
compatibility to older browsers. If you want to use particular functions that
some browsers don't support, you'll have to add a polyfill.

The build process will also move the source files into one distribution file and
minify the code.
