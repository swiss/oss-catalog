export async function getSoftwares(): Promise<Software[]> {
  const apiBaseUrl = import.meta.env.API_BASEURL || "http://localhost:3000/v1";
  const url = `${apiBaseUrl}/software?page[size]=10000`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const rawSoftwares = data.data ?? [];
  return rawSoftwares;
}

export type Software = {
  id: string;
  name: string;
  url: string;
  categories: string[];
  developmentStatus: string;
  softwareType: string;
  description: string;
  legal: {
    license: string;
  };
  publiccodeYml: string;
  publiccode: PubliccodeYml;
};

export type PubliccodeYml = {
  publiccodeYmlVersion?: string;
  name: string;
  applicationSuite?: string;
  url?: string;
  landingURL?: string;
  isBasedOn?: string | string[];
  softwareVersion?: string;
  releaseDate?: string;
  logo?: string;
  monochromeLogo?: string;
  inputTypes?: string[];
  outputTypes?: string[];
  platforms?: string[];
  categories?: string[];
  usedBy?: string[];
  fundedBy?: FundingSource[];
  roadmap?: string;
  developmentStatus?: string;
  softwareType?: string;
  supports?: string[];
  organisation?: {
    uri?: string;
    name?: string;
  };
  intendedAudience?: {
    countries?: string[];
    unsupportedCountries?: string[];
    scope?: string[];
  };
  description?: Record<string, LocalizedDescription>;
  legal?: {
    license?: string;
    mainCopyrightOwner?: string;
    repoOwner?: string;
    authorsFile?: string;
  };
  maintenance?: {
    type?: string;
    contractors?: Contractor[];
    contacts?: Contact[];
  };
  localisation?: {
    localisationReady?: boolean;
    availableLanguages?: string[];
  };
  dependsOn?: {
    open?: Dependency[];
    proprietary?: Dependency[];
    hardware?: Dependency[];
  };
};

export type LocalizedDescription = {
  localisedName?: string;
  genericName?: string;
  shortDescription?: string;
  longDescription?: string;
  documentation?: string;
  apiDocumentation?: string;
  features?: string[];
  screenshots?: string[];
  videos?: string[];
  awards?: string[];
};

export type FundingSource = {
  name: string;
  uri?: string;
};

export type Contact = {
  name: string;
  email?: string;
  phone?: string;
  affiliation?: string;
};

export type Contractor = {
  name: string;
  website?: string;
  until?: string;
};

export type Dependency = {
  name: string;
  optional?: boolean;
  version?: string;
  versionMax?: string;
  versionMin?: string;
};
