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
  };
  description: Record<
    string,
    {
      shortDescription: string;
    }
  >;
};
