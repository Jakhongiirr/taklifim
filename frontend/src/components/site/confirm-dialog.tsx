"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Red confirm button, for destructive actions. */
  danger?: boolean;
}

/**
 * The site's own confirm dialog, instead of the browser's window.confirm:
 * a bottom sheet on phones, a centered card on larger screens.
 *
 *   const { confirm, dialog } = useConfirm();
 *   if (!(await confirm({ ... }))) return;
 *   ...
 *   return <>{dialog}...</>;
 */
export function useConfirm() {
  const ref = useRef<HTMLDialogElement>(null);
  const resolve = useRef<((ok: boolean) => void) | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback(
    (next: ConfirmOptions) =>
      new Promise<boolean>((done) => {
        resolve.current?.(false);
        resolve.current = done;
        setOptions(next);
      }),
    [],
  );

  // showModal() gives focus trapping, Esc to cancel and an inert page.
  useEffect(() => {
    if (options && !ref.current?.open) ref.current?.showModal();
  }, [options]);

  const close = (ok: boolean) => {
    resolve.current?.(ok);
    resolve.current = null;
    ref.current?.close();
    setOptions(null);
  };

  const dialog = options && (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        close(false);
      }}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(e) => e.target === ref.current && close(false)}
      className="mx-0 mt-auto mb-0 w-full max-w-none rounded-t-3xl bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] sm:m-auto sm:max-w-sm sm:rounded-3xl"
    >
      <div className="px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <h2 id="confirm-title" className="font-serif text-2xl text-ink">
          {options.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {options.message}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={() => close(false)}
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium text-ink ring-1 ring-line hover:ring-ink/30 sm:h-11"
          >
            {options.cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => close(true)}
            className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium text-paper sm:h-11 ${options.danger ? "bg-red-700 hover:bg-red-800" : "bg-sage hover:bg-sage-dark"}`}
          >
            {options.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );

  return { confirm, dialog };
}
