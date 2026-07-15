import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "../../../components/Header";
import { createClient } from "../../../utils/supabase/server";
import { getCurrentProfile, isStaff } from "../../../utils/auth";
import ManagePicksClient from "../../../components/ManagePicksClient";

export const revalidate = 0;

export default async function ManagePicksPage() {
  const profile = await getCurrentProfile();
  
  if (!isStaff(profile)) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/editor/manage");
  }

  // Fetch only this staff's picks
  const { data: picks, error } = await supabase
    .from("editor_picks")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load managed picks:", error);
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <ManagePicksClient 
          initialPicks={picks || []} 
          locale={locale} 
        />
      </main>
    </div>
  );
}
