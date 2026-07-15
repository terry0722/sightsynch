import { createClient } from "./supabase/server";

export interface Profile {
  id: string;
  role: "user" | "editor" | "admin";
  display_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return profile as Profile | null;
  } catch (err) {
    console.error("getCurrentProfile error:", err);
    return null;
  }
}

export function isStaff(profile: { role: string } | null): boolean {
  if (!profile) return false;
  return profile.role === "editor" || profile.role === "admin";
}
