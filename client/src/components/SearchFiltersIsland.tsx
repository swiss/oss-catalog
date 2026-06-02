import { useState } from "react";
import type { Lang } from "../i18n/utils";
import { useTranslations } from "../i18n/utils";
import {
  type Department,
  SoftwareFilters,
} from "@/components/SoftwareFilters.tsx";
import { useStore } from "@nanostores/react";
import { nameQuery } from "@/stores/filters";

interface Props {
  lang: Lang;
  organisations: Department[];
}

export default function SearchFiltersIsland({ lang, organisations }: Props) {
  const t = useTranslations(lang);
  const [isOpen, setIsOpen] = useState(false);
  const $nameQuery = useStore(nameQuery);

  return (
    <>
      <div className="search search--large search--page-result">
        <div className="search__group">
          <input
            id="search-input"
            type="search"
            aria-labelledby="search-button"
            placeholder={t("index.search")}
            autoComplete="off"
            value={$nameQuery}
            onChange={(e) => nameQuery.set(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--bare btn--lg btn--icon-only"
            disabled
            aria-hidden="true"
            tabIndex={-1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              enableBackground="new 0 0 24 24"
              className="icon icon--3xl icon--Search"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="m13.3 12.8c1.9-2.2 1.7-5.6-.5-7.5s-5.6-1.7-7.5.5-1.7 5.6.5 7.5c2 1.7 4.9 1.7 6.9 0l6 6 .5-.5zm-4 1c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"
              />
            </svg>
            <span className="btn__text" id="search-button">
              {t("index.search")}
            </span>
          </button>
        </div>
      </div>

      <div className={`search__filters ${isOpen ? "filters--are-open" : ""}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`btn btn--bare btn--sm btn--icon-left ${isOpen ? "btn--icon-180" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="icon icon--base icon--ChevronDown btn__icon"
            aria-hidden="true"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="m5.706 10.015 6.669 3.85 6.669-3.85.375.649-7.044 4.067-7.044-4.067z"
            />
          </svg>
          <span className="btn__text">
            {isOpen
              ? t("index.search.filter.close")
              : t("index.search.filter.open")}
          </span>
        </button>

        <div className="search__filters__drawer" hidden={!isOpen}>
          <div className="form__group__select">
            <SoftwareFilters
              lang={lang}
              organisations={organisations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
