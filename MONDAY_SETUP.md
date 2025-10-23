# Monday.com Integration Setup

## Environment Variables (Required)

This Next.js site uses secure server-side API routes. You must configure environment variables:

1. **For local development**, create a `.env.local` file in your project root:
```bash
MONDAY_API_TOKEN=your_personal_api_token_here
MONDAY_BOARD_ID=your_board_id_here
```

2. **For production (Vercel)**, add these in your Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `MONDAY_API_TOKEN` with your token
   - Add `MONDAY_BOARD_ID` with your board ID
   - Set scope to "Production" (and "Preview" if needed)

3. Get your values:
   - **API Token**: Monday.com → Admin → API → Generate Personal API Token
   - **Board ID**: From your board URL (the number at the end)

## Security Notes:

- ✅ API credentials are kept on the server (secure)
- ✅ Never use `NEXT_PUBLIC_` prefix for API keys
- ✅ The `.env.local` file is in `.gitignore`
- ❌ Never commit API tokens to Git

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
