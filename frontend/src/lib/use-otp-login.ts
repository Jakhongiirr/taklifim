"use client";

import { useEffect, useState } from "react";
import { ApiError, authApi } from "./api-client";
import type { OtpRequested, User } from "./api-types";

/**
 * State for the phone + Telegram code login, shared by the admin and the
 * public login forms. `error` is the raw error; each form words it itself.
 */
export function useOtpLogin() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [pending, setPending] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  async function requestCode() {
    setError(null);
    setPending(true);
    try {
      const res = await authApi<OtpRequested>("/otp/request", { phone });
      setResendIn(res.retryAfter);
      setStep("code");
      setCode("");
    } catch (e) {
      // On cooldown a code was already sent: let the user enter it.
      const details = e instanceof ApiError ? e.details : undefined;
      const retryAfter = (details as { retryAfter?: number } | undefined)
        ?.retryAfter;
      if (retryAfter) {
        setResendIn(retryAfter);
        setStep("code");
      }
      setError(e);
    } finally {
      setPending(false);
    }
  }

  /** Logs in (session cookies are set); null if it failed (see `error`). */
  async function verify(): Promise<User | null> {
    setError(null);
    setPending(true);
    try {
      const { user } = await authApi<{ user: User }>("/otp/verify", {
        phone,
        code,
      });
      return user;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setPending(false);
    }
  }

  function changeNumber() {
    setStep("phone");
    setError(null);
  }

  return {
    step,
    phone,
    setPhone,
    code,
    setCode: (value: string) => setCode(value.replace(/\D/g, "")),
    error,
    setError,
    pending,
    resendIn,
    requestCode,
    verify,
    changeNumber,
  };
}
