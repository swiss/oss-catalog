import { useMemo } from "react";
import { useStore } from "@nanostores/react";
import type { WritableAtom } from "nanostores";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type OrganisationType,
  clearSelectionsForType,
  organisationType,
  selectedCantons,
  selectedMunicipalities,
} from "@/stores/filters";
import {
  findOrganisation,
  getCantonOfMunicipality,
  getOrganisationKind,
  isCantonGroup,
  localizedName,
  organisations,
} from "@/lib/organisations";
import { type Lang, useTranslations } from "@/i18n/utils";

type Props = {
  lang: Lang;
  organisationUris: (string | undefined)[];
};

type Option = { id: string; label: string; count?: number };
type Section = { id: string; title?: string; options: Option[] };

export default function OrganisationTypeFilter({
  lang,
  organisationUris,
}: Props) {
  const t = useTranslations(lang);
  const $type = useStore(organisationType);

  const softwareCounts = useMemo(() => {
    return organisationUris.reduce((counts, uri) => {
      if (uri && getOrganisationKind(uri) !== "bund") {
        counts.set(uri, (counts.get(uri) ?? 0) + 1);
      }
      return counts;
    }, new Map<string, number>());
  }, [organisationUris]);

  const byLabel = (a: Option, b: Option) =>
    a.label.localeCompare(b.label, lang);

  const cantonSections = useMemo((): Section[] => {
    const group = organisations.find(isCantonGroup);
    if (!group) return [];
    const options = group.organisations
      .map((o) => ({
        id: o.id,
        label: localizedName(o.name, lang) ?? o.id,
        count: softwareCounts.get(o.id),
      }))
      .sort(byLabel);
    return [{ id: group.id, options }];
  }, [lang, softwareCounts]);

  // Only municipalities with software, grouped by canton: all 2110 would be unusable.
  const municipalitySections = useMemo((): Section[] => {
    const sections = new Map<string, Section>();
    for (const [uri, count] of softwareCounts) {
      const found = findOrganisation(uri);
      const cantonUri = getCantonOfMunicipality(uri);
      if (!found || !cantonUri) continue;
      const section = sections.get(cantonUri) ?? {
        id: cantonUri,
        title: localizedName(
          findOrganisation(cantonUri)?.organisation.name,
          lang,
        ),
        options: [],
      };
      section.options.push({
        id: uri,
        label: localizedName(found.organisation.name, lang) ?? uri,
        count,
      });
      sections.set(cantonUri, section);
    }
    return [...sections.values()]
      .map((s) => ({ ...s, options: s.options.sort(byLabel) }))
      .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? "", lang));
  }, [softwareCounts, lang]);

  const setType = (selected: OrganisationType) => {
    if (selected === $type) return;
    organisationType.set(selected);
    clearSelectionsForType(selected);
  };

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
      <SelectionButton
        type="cantons"
        currentType={$type}
        setType={setType}
        store={selectedCantons}
        sections={cantonSections}
        label={t("index.filter.option.cantons")}
        openLabel={t("index.filter.option.cantons.open")}
        selectAllLabel={t("select.all")}
        clearLabel={t("select.clear")}
      />
      <SelectionButton
        type="municipalities"
        currentType={$type}
        setType={setType}
        store={selectedMunicipalities}
        sections={municipalitySections}
        label={t("index.filter.option.municipalities")}
        openLabel={t("index.filter.option.municipalities.open")}
        emptyLabel={t("index.filter.option.municipalities.empty")}
        selectAllLabel={t("select.all")}
        clearLabel={t("select.clear")}
      />
    </div>
  );
}

function SelectionButton({
  type,
  currentType,
  setType,
  store,
  sections,
  label,
  openLabel,
  selectAllLabel,
  clearLabel,
  emptyLabel,
}: {
  type: OrganisationType;
  currentType: OrganisationType;
  setType: (type: OrganisationType) => void;
  store: WritableAtom<string[]>;
  sections: Section[];
  label: string;
  openLabel: string;
  selectAllLabel: string;
  clearLabel: string;
  emptyLabel?: string;
}) {
  const selected = useStore(store);
  const active = currentType === type;
  const allIds = sections.flatMap((s) => s.options.map((o) => o.id));

  const toggle = (id: string) =>
    store.set(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );

  // Anchored to the whole group, not the chevron: the label width changes with the selection count.
  return (
    <Popover>
      <PopoverAnchor asChild>
        <div className="flex items-stretch">
          <button
            type="button"
            className={`btn btn--sm ${active ? "btn--outline" : ""}`}
            aria-pressed={active}
            onClick={() => setType(type)}
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          >
            <span className="btn__text">
              {selected.length > 0 ? `${label} (${selected.length})` : label}
            </span>
          </button>

          <PopoverTrigger asChild>
            <button
              type="button"
              className={`btn btn--sm btn--icon-only ${active ? "btn--outline" : ""}`}
              aria-label={openLabel}
              onClick={() => setType(type)}
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
        </div>
      </PopoverAnchor>
      <PopoverContent className="w-[min(28rem,90vw)] p-0 bg-white">
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b">
          <span className="text--sm font-bold">{openLabel}</span>
          {allIds.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn--bare btn--sm"
                onClick={() => store.set(allIds)}
                disabled={selected.length === allIds.length}
              >
                <span className="btn__text">{selectAllLabel}</span>
              </button>
              <button
                type="button"
                className="btn btn--bare btn--sm"
                onClick={() => store.set([])}
                disabled={selected.length === 0}
              >
                <span className="btn__text">{clearLabel}</span>
              </button>
            </div>
          )}
        </div>
        {allIds.length === 0 && emptyLabel && (
          <p className="px-3 py-3 text--sm">{emptyLabel}</p>
        )}
        <fieldset
          hidden={allIds.length === 0}
          className="max-h-80 overflow-y-auto py-2 border-0"
        >
          <legend className="sr-only">{openLabel}</legend>
          {sections.map((section) => (
            <div
              key={section.id}
              role={section.title ? "group" : undefined}
              aria-label={section.title}
            >
              {section.title && (
                <div className="px-3 pt-2 text--sm font-bold">
                  {section.title}
                </div>
              )}
              {section.options.map((o) => (
                <div key={o.id} className="px-3 py-1 hover:bg-gray-50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(o.id)}
                      onChange={() => toggle(o.id)}
                    />
                    <span className="pr-0.5 py-1">{o.label}</span>
                    {o.count && (
                      <span className="badge badge--sm badge--gray">
                        {o.count}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </fieldset>
      </PopoverContent>
    </Popover>
  );
}
