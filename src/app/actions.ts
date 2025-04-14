"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  // Placeholder voor toekomstige authentificatie logica
  console.log("Sign up functionaliteit moet nog worden geïmplementeerd");
  console.log("Gebruikersgegevens:", { email, password, fullName });

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Placeholder voor toekomstige authentificatie logica
  console.log("Sign in functionaliteit moet nog worden geïmplementeerd");
  console.log("Inloggegevens:", { email, password });

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  // Placeholder voor toekomstige wachtwoord reset logica
  console.log("Wachtwoord reset functionaliteit moet nog worden geïmplementeerd");
  console.log("Email voor reset:", email);

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  // Placeholder voor toekomstige wachtwoord update logica
  console.log("Wachtwoord update functionaliteit moet nog worden geïmplementeerd");
  console.log("Nieuwe wachtwoord lengte:", password.length);

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  // Placeholder voor toekomstige uitlog logica
  console.log("Sign out functionaliteit moet nog worden geïmplementeerd");
  
  return redirect("/sign-in");
};