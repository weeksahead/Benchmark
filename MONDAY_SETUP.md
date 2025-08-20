# Monday.com Integration Setup

## Option 1: Environment Variables (Recommended for Production)

1. Create a `.env` file in your project root:
```bash
VITE_MONDAY_API_TOKEN=your_personal_api_token_here
VITE_MONDAY_BOARD_ID=your_board_id_here
```

2. Replace the values with your actual:
   - **API Token**: From Monday.com → Admin → API → Generate Token
   - **Board ID**: From your board URL (the number at the end)

## Option 2: Direct Config (Good for Development)

If you prefer to keep it simple for development, you can directly edit `src/config/monday.ts`:

```typescript
export const MONDAY_CONFIG = {
  API_TOKEN: 'your_actual_token_here',
  BOARD_ID: 'your_actual_board_id_here',
  // ... rest stays the same
};
```

## Security Notes:

- **Development**: Either approach is fine
- **Production**: Always use environment variables
- **Never commit API tokens to Git**
- **The .env file should be in .gitignore**

## Testing:

1. Fill out the contact form
2. Submit it
3. Check your Monday.com "Online Leads" board
4. You should see a new lead appear!

## Troubleshooting:

- Check browser console for errors
- Verify API token is correct
- Verify Board ID is correct
- Make sure your Monday.com board has the right column names
