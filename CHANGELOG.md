# Changelog

## [Development](https://github.com/knaw-huc/Dexter/tree/development)
🧪 Features / ✨ Enhancements / 🔧 Technical / 🐛 Bug Fixes

## [v0.14](https://github.com/knaw-huc/Dexter/releases/tag/v0.14.7)
### 🧪 Features 
- Export corpus and its subcorpora, sources, media and references to a zip with csv files
- Add tooltips to form fields and page headers with descriptions (loaded from backend `assets/labels.json`)
- Add dropdown that allows users to change their reference style 
- Add 'external identifier' field to sources

### ✨ Enhancements 
- On the corpus page in the subcorpora section: show the tags of sources and subcorpora of a corpus   
- Remove 'restricted' access option
- Align texts and styling of button icons and texts
- 
### 🔧 Technical 
- Manage the state of corpus and source pages with zustand
- Store user settings in the backend (only contains configured reference style atm)
- Add constraint to backend error message, to allow for more specific and readable frontend error message

### 🐛 Bug Fixes
- Attach a newly created source to its corpus when creating a new source from a corpus page
- Actually update reference when editing, instead of creating a new reference

## [v0.13](https://github.com/knaw-huc/Dexter/releases/tag/v0.13.2)
### 🧪 Features
- Add references that can be imported using doi of bibtex and can be linked to multiple sources

### Enhancements
- Add dexter version number to the user menu

### 🔧 Technical 
- Add jest testing framework to frontend
- Structure error handling across app
- Create single, shared autocomplete component to select and remove multiple options
- Add hash to js bundle to force reload


## [v0.12](https://github.com/knaw-huc/Dexter/releases/tag/v0.12.2)
### 🧪 Features 
- Add 'media' (only images now) with an url and title
- Add media to sources
- Display image in preview of corpora and sources

### ✨ Enhancements 
- Display subcorpora on the corpus page
- Filter subcorpora by their tags and the tags of their subcorpora and sources
- Move languages to summary paragraph on source and corpus page

### 🔧 Technical
- Add ID to json parsing error responses to trace it back to backend error logging for more details 
  (without exposing all kinds of implementation details)

## [v0.11.0](https://github.com/knaw-huc/Dexter/releases/tag/v0.11.0)

### 🧪 Features
- Define, fill out and display custom metadata fields for sources and corpora
- Users can see and edit only their own corpora, sources and custom metadata
- Add ethics field

### ✨ Enhancements
- Only the title field is required when creating and editing a new source or corpus
- Indicate import is running by showing a spinner
- Create new keywords within the 'add keyword' field, when creating and editing sources and corpora
- Rename keyword to tag

### 🔧 Technical
- Use `prettier` to align code style when committing new code
- Use custom hooks to organize business the more complex logic of source and corpus forms
- Replace form management of react-hook-form by plain react code
- Document database model in readme

## [v0.10.0](https://github.com/knaw-huc/Dexter/releases/tag/v0.10.0)

### 🧪 Features
- Filter corpus sources by keywords
- Breadcrumb navigation
- Import of wereld culturen dublin core fields (start date, end date, title, description)
- Navigation menu, including logged-in user

### ✨ Enhancements
- Display of corpora, sources and keywords
