# News Page Implementation Guide

## Overview
The News page serves as a hub for updates, primarily focusing on "Recently Added Shops/Restaurants" for the initial version.

## Design
- **Hero Section**: Simple "News" header.
- **Recently Added Section**: A grid or list of cards displaying new venues.

## Components
### `NewsCard`
Displays individual news items (e.g., a new restaurant).
- **Props**:
  - `title` (string): Name of the shop/restaurant.
  - `image` (string): URL of the avatar/image.
  - `description` (string): Short description.
  - `link` (string): URL to the full details (e.g., `/restaurant/[id]`).

### `RecentlyAddedSection`
Contains the list of `NewsCard` components.
- **Data**: Static array of objects for now.

## Future Improvements
- Connect to Backend API to fetch real "newly created" restaurants.
- Add Redux slice for caching news data.
- Add pagination or "Load More".
