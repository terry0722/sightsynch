import React from "react";
import { cookies } from "next/headers";
import { createClient } from "../utils/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";

  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      user = data.user;
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      profile = profileData;
    }
  } catch (err) {
    console.error("Header auth loading failed:", err);
  }

  return (
    <HeaderClient 
      user={user} 
      profile={profile} 
      locale={locale} 
    />
  );
}
