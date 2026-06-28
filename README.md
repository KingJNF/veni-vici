# Web Development Project 4 - *Veni Vici!*

Submitted by: **Jaime Nunez**

This web app: **is a video game discovery tool, similar to the now-defunct StumbleUpon. Users click a "Discover!" button to fetch a random video game from the RAWG Video Games Database API, displaying the game's image along with its genre, platform, release year, and rating. Users can click on attributes (genre, platform, or release year) to add them to a ban list, preventing games with those attributes from appearing in future results. The app also keeps a running history of every game viewed during the session.**

Time spent: **3** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - The type of attribute displayed for each image is consistent across API calls (genre, platform, release year and rating are shown for every game)
- [x] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - A single game result is displayed at a time
  - Displayed attributes match the displayed game's image
  - There is one image per API call
- [x] **API call response results appear random to the user**
  - Clicking the "Discover!" button generates a seemingly random new game each time by fetching from a randomized page of the RAWG database (~870,000+ games)
  - Repeats are rare due to the large dataset
- [x] **Clicking on a displayed value for one attribute adds it to a displayed ban list**
  - Genre, platform, and release year are all clickable
  - Clicking a clickable attribute not on the ban list immediately adds it to the ban list
  - Clicking an attribute in the ban list immediately removes it from the ban list
- [x] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - When an attribute is banned, clicking "Discover!" never returns a game with that attribute value (a fetch-and-retry loop filters out banned results)


The following **optional** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list
  - Genre, platform, and release year can each be independently banned
- [x] Users can see a stored history of their previously displayed results from this session
  - A dedicated History panel displays all previously viewed games
  - Each time the "Discover!" button is clicked, the history updates with the previous result

The following **additional** features are implemented:

* [x] Loading state on the Discover button to indicate when a fetch is in progress
* [x] Error handling that notifies the user if no unbanned game can be found
* [x] Responsive, styled card-based UI with hover effects on clickable attributes

## Video Walkthrough

Here's a video walkthrough of implemented user stories:

**[Watch the walkthrough](https://www.loom.com/share/8766d0f3d75e4008875cb5e72f3fca81)**

## Notes

One of the main challenges was implementing the ban list filtering, since the RAWG API does not support an "exclude" query parameter. I solved this with a fetch-and-retry loop that re-fetches a random game (up to a max number of attempts) whenever a result matches a banned attribute, which prevents infinite loops when many attributes are banned.