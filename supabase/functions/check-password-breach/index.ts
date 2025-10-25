import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordCheckRequest {
  password: string;
}

interface PasswordCheckResponse {
  isBreached: boolean;
  breachCount?: number;
}

async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

async function checkPasswordBreach(password: string): Promise<PasswordCheckResponse> {
  try {
    // Generate SHA-1 hash of password
    const hash = await sha1(password);
    
    // Use k-anonymity: send only first 5 characters
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    
    console.log(`Checking password breach with prefix: ${prefix}`);
    
    // Query Have I Been Pwned API
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          'User-Agent': 'PsyBalans-Password-Checker',
        },
      }
    );
    
    if (!response.ok) {
      console.error(`HIBP API error: ${response.status}`);
      throw new Error('Failed to check password');
    }
    
    const text = await response.text();
    const hashes = text.split('\n');
    
    // Check if our hash suffix is in the response
    for (const line of hashes) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        const breachCount = parseInt(count.trim(), 10);
        console.log(`Password found in ${breachCount} breaches`);
        return {
          isBreached: true,
          breachCount,
        };
      }
    }
    
    console.log('Password not found in breaches');
    return {
      isBreached: false,
    };
  } catch (error) {
    console.error('Error checking password:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password }: PasswordCheckRequest = await req.json();
    
    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (password.length < 1) {
      return new Response(
        JSON.stringify({ error: 'Password cannot be empty' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const result = await checkPasswordBreach(password);
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in check-password-breach function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        isBreached: false, // Fail open - don't block user if check fails
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
