import { useMemo } from "react";
import { useStore } from "@nanostores/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Department, type Locale } from "@/components/SoftwareFilters";
import {
  CANTON_URI_PREFIX,
  type OrganisationType,
  organisationType,
  selectedCantons,
  selectedOrganisations,
} from "@/stores/filters";
import { useTranslations } from "@/i18n/utils";
import type { Software } from "@/lib/software.ts";

type Props = {
  lang: Locale;
  organisations: Department[];
  softwares: Software[];
};

export default function OrganisationTypeFilter({
  lang,
  organisations,
  softwares,
}: Props) {
  const t = useTranslations(lang);
  const $type = useStore(organisationType);
  const $selected = useStore(selectedCantons);

  const cantons = useMemo(() => {
    const departement = organisations.find((d) =>
      d.id.startsWith(CANTON_URI_PREFIX),
    );
    if (!departement) return [];

    return departement.organisations
      .map((o) => ({
        id: o.id,
        label: o.name[lang] ?? o.name.de ?? o.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, lang));
  }, [organisations, lang]);

  const softwareCounts = useMemo(() => {
    return softwares.reduce((counts, software) => {
      const uri = software.publiccode?.organisation?.uri;
      if (uri?.startsWith(CANTON_URI_PREFIX)) {
        counts.set(uri, (counts.get(uri) ?? 0) + 1);
      }
      return counts;
    }, new Map<string, number>());
  }, [softwares]);

  const selected = useMemo(
    () => $selected.filter((s) => s.startsWith(CANTON_URI_PREFIX)),
    [$selected],
  );

  const setType = (selected: OrganisationType) => {
    if (selected === $type) return;
    organisationType.set(selected);
    if (selected === "cantons") {
      selectedOrganisations.set([]);
    }
    if (selected === "bund" || selected === "all") {
      selectedCantons.set([]);
    }
  };

  const toggleCanton = (canton: string) => {
    const selected = selectedCantons.get();
    const updated = selected.includes(canton)
      ? selected.filter((s) => s !== canton)
      : [...selected, canton];
    selectedCantons.set(updated);
  };

  const cantonsButtonLabel =
    selected.length > 0
      ? `${t("index.filter.option.cantons")} (${selected.length})`
      : t("index.filter.option.cantons");

  return (
    <div
      className="flex flex-wrap items-stretch gap-2 mb-4"
      role="group"
      aria-label={t("index.filter.type")}
    >
      <button
        type="button"
        className={`btn btn--sm ${$type === "all" ? "btn--outline" : ""}`}
        aria-pressed={$type === "all"}
        onClick={() => setType("all")}
      >
        <span className="btn__text">{t("index.filter.option.all")}</span>
      </button>

      <button
        type="button"
        className={`btn btn--sm ${$type === "bund" ? "btn--outline" : ""}`}
        aria-pressed={$type === "bund"}
        onClick={() => setType("bund")}
      >
        <span className="btn__text">{t("index.filter.option.bund")}</span>
      </button>
      <div className="flex items-stretch">
        <button
          type="button"
          className={`btn btn--sm ${$type === "cantons" ? "btn--outline" : ""}`}
          aria-pressed={$type === "cantons"}
          onClick={() => setType("cantons")}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          <span className="btn__text">{cantonsButtonLabel}</span>
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`btn btn--sm btn--icon-only ${$type === "cantons" ? "btn--outline" : ""}`}
              aria-label={t("index.filter.option.cantons.open")}
              onClick={() => {
                if ($type !== "cantons") setType("cantons");
              }}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                marginLeft: "-1px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="icon icon--base icon--ChevronDown btn__icon"
                aria-hidden="true"
              >
                <path d="m5.706 10.015 6.669 3.85 6.669-3.85.375.649-7.044 4.067-7.044-4.067z" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[min(28rem,90vw)] p-0 bg-white">
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b">
              <span className="text--sm font-bold">
                {t("index.filter.option.cantons.open")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn btn--bare btn--sm"
                  onClick={() => selectedCantons.set(cantons.map((c) => c.id))}
                  disabled={selected.length === cantons.length}
                >
                  <span className="btn__text">{t("select.all")}</span>
                </button>
                <button
                  type="button"
                  className="btn btn--bare btn--sm"
                  onClick={() => selectedCantons.set([])}
                  disabled={selected.length === 0}
                >
                  <span className="btn__text">{t("select.clear")}</span>
                </button>
              </div>
            </div>
            <ul
              role="listbox"
              aria-multiselectable="true"
              className="max-h-80 overflow-y-auto py-2"
            >
              {cantons.map((c) => {
                const checked = selected.includes(c.id);
                const count = softwareCounts.get(c.id);
                return (
                  <li key={c.id}>
                    <label className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCanton(c.id)}
                      />
                      <span className="pr-0.5 py-1">{c.label} </span>
                      {count &&
                        (<div className="badge badge--sm badge--gray">
                          {count}
                        </div>)
                      }

                    </label>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
