import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "../../../../components/Header";
import { createClient } from "../../../../utils/supabase/server";
import { getCurrentProfile, isStaff } from "../../../../utils/auth";
import PickForm from "../../../../components/PickForm";
import { getTranslation } from "../../../../utils/i18n";

export const revalidate = 0;

export default async function NewPickPage() {
  const profile = await getCurrentProfile();
  
  if (!isStaff(profile)) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/editor/manage/new");
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-6 mb-12">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-2">
            STAFF DASHBOARD / WRITE
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-neutral-900 uppercase">
            {t("newPick")}
          </h1>
        </div>

        <PickForm 
          userId={user.id} 
          locale={locale} 
        />
      </main>
    </div>
  );
}
