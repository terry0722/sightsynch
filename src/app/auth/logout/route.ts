import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

async function handleLogout(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/`, {
    status: 303, // Redirect via 303 for clean routing
  });
}

export { handleLogout as GET, handleLogout as POST };
