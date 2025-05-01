# Coffee Tracker

A simple application to track your coffee experiences at different coffee shops.

## Overview

Coffee Tracker allows you to:
- Add different types of coffee
- Add coffee shops
- Record your coffee experiences with ratings and notes
- View your coffee journal

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technical Implementation

This project uses:
- **Next.js** for the frontend and API routes
- **JSON files** for data persistence (file-based storage in the `data` directory)
- **Tailwind CSS** for styling

## Usage Notes

### Data Storage

Currently, the application uses a simple file-based storage solution instead of a database to avoid compatibility issues. All data is stored in JSON files located in the `data` directory.

### Adding Coffee Shops

1. Navigate to the "Settings" tab
2. Fill out the "Add New Coffee Shop" form with name and optional location
3. Click "Add Coffee Shop" to save

### Adding Coffee Types

1. Navigate to the "Settings" tab
2. Fill out the "Add New Coffee Type" form with name and optional description
3. Click "Add Coffee Type" to save

### Tracking Your Coffee

1. Navigate to the "Add Coffee" tab
2. Select the coffee type and shop
3. Add your rating and notes
4. Click "Add to Journal" to save your coffee experience

## Future Improvements

- Implement proper database storage if needed (e.g., SQLite, MongoDB, etc.)
- Add user authentication
- Add photos to coffee entries
- Implement search and filtering capabilities
