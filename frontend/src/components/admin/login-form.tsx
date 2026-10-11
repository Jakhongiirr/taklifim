"use client";

import type { FormEvent } from "react";
import { ApiError, authApi } from "@/lib/api-client";
import { useOtpLogin } from "@/lib/use-otp-login";
import { Alert, Button, Field, Input } from "./ui";

function messageOf(error: unknown) {
  if (!error) return "";
  if (error instanceof ApiError) return error.fullMessage;
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function LoginForm({ next }: { next: string }) {
  const login = useOtpLogin();
  const { step, phone, code, resendIn, pending } = login;

  async function verify() {
    const user = await login.verify();
    if (!user) return;
    if (user.role !== "admin") {
      await authApi("/logout");
      login.setError(new Error("This account doesn't have admin access."));
      return;
    }
    window.location.assign(next);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void (step === "phone" ? login.requestCode() : verify());
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Phone number">
        <Input
          type="tel"
          autoComplete="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          onChange={(e) => login.setPhone(e.target.value)}
          disabled={step === "code"}
          required
          autoFocus
        />
      </Field>

      {step === "code" && (
        <Field
          label="Code"
          hint={
            <span className="flex items-center justify-between">
              <span>Check Telegram’s “Verification Codes” chat.</span>
              <span className="flex gap-3">
                <button
                  type="button"
                  className="underline disabled:no-underline disabled:opacity-60"
                  disabled={resendIn > 0 || pending}
                  onClick={() => void login.requestCode()}
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
                <button
                  type="button"
                  className="underline"
                  onClick={login.changeNumber}
                >
                  Change number
                </button>
              </span>
            </span>
          }
        >
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={code}
            onChange={(e) => login.setCode(e.target.value)}
            maxLength={8}
            required
            autoFocus
          />
        </Field>
      )}

      <Alert>{messageOf(login.error)}</Alert>

      <Button type="submit" loading={pending}>
        {step === "phone" ? "Send code" : "Log in"}
      </Button>
    </form>
  );
}
