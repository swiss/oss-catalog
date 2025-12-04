export type Software = {
  id: string;
  name: string;
  organisationUri: string;
  categories: string[];
  developmentStatus: string;
  softwareType: string;
  description: string;
  legal: {
    license: string;
  };
  publiccodeYml: string;
};
