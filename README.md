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

Will try to place the instructions/the button for showing the instructions
after the description. If no description is available, will try under the label.
If no label is available, will put it before the first field.
