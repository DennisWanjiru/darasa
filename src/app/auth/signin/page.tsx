"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/schema";
import Logo from "@/components/Logo";

export default function AuthForm() {
  console.log({ url: process.env.NEXT_PUBLIC_REDIRECT_URL });
  const supabase = createClientComponentClient<Database>();

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-secondary">
      <Logo />

      <section className="w-[30%] max-w-[500px] mt-10">
        <Auth
          supabaseClient={supabase}
          view="magic_link"
          showLinks={false}
          providers={[]}
          redirectTo={process.env.NEXT_PUBLIC_REDIRECT_URL}
          appearance={{
            style: {
              button: {
                background: "black",
                color: "white",
                height: "50px",
                borderRadius: "10px",
              },
              input: {
                background: "#F6F5F5",
                color: "#030229",
                height: "50px",
                paddingLeft: "20px",
                paddingRight: "20px",
                borderRadius: "10px",
                borderColor: "#f6f5f5",
                marginTop: "16px",
              },
              label: {
                fontWeight: 600,
                color: "#030229",
              },
            },
          }}
          localization={{
            variables: {
              magic_link: {
                email_input_label: "Email",
                email_input_placeholder: "Enter your email address",
              },
            },
          }}
        />
      </section>
    </main>
  );
}
