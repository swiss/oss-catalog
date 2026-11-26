import { useEffect, useRef, useState } from "react";
import { type Lang, useTranslations } from "@/i18n/utils";

const EDITOR_URL =
  import.meta.env.PUBLIC_EDITOR_URL ??
  "https://swiss.github.io/publiccode-editor";

// Contract with the publiccode-editor: embed.js exports mount(), which returns an unmount function.
type Mount = (el: HTMLElement, options: { lang: Lang }) => () => void;

interface Props {
  lang: Lang;
}

export default function EditorIsland({ lang }: Props) {
  const t = useTranslations(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let unmount: (() => void) | undefined;
    let cancelled = false;

    import(/* @vite-ignore */ `${EDITOR_URL}/embed.js`)
      .then(({ mount }: { mount: Mount }) => {
        if (cancelled || !ref.current) return;
        unmount = mount(ref.current, { lang });
        setState("ready");
      })
      .catch((error) => {
        console.error("Failed to load the publiccode editor", error);
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, [lang]);

  return (
    <>
      {state === "loading" && <p role="status">{t("editor.loading")}</p>}
      {state === "error" && (
        <p role="alert">
          {t("editor.error")}{" "}
          <a href={`${EDITOR_URL}/?lang=${lang}`} target="_blank">
            {t("editor.open")}
          </a>
        </p>
      )}
      <div ref={ref} />
    </>
  );
}
