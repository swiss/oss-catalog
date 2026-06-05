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
  name: string;
  releaseDate: string;
  softwareVersion: string;
  legal: {
    license: string;
  };
  organisation: {
    uri: string;
    name?: string;
  };
  description: Record<
    string,
    {
      shortDescription: string;
    }
  >;
};
