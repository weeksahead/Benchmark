// Monday.com API Configuration
export const MONDAY_CONFIG = {
  // Get from environment variables (more secure) or use fallback values
  API_TOKEN: process.env.NEXT_PUBLIC_MONDAY_API_TOKEN || 'YOUR_MONDAY_API_TOKEN_HERE',

  // Get from environment variables (more secure) or use fallback values
  BOARD_ID: process.env.NEXT_PUBLIC_MONDAY_BOARD_ID || 'YOUR_BOARD_ID_HERE',
  
  // Column IDs mapping (these match your Monday.com board columns)
  COLUMNS: {
    FULL_NAME: 'name',           // Name column
    PHONE: 'phone_mkv0nh94',     // Phone column  
    EMAIL: 'email_mkv06d0n',     // Email column
    COMPANY: 'text_mkv0kyy4',    // Company Name column
    REQUEST: 'text_mkv07z2h'     // Request column
  }
};
