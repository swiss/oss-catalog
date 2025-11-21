export type Software = {
  id: string;
  name: string;
  url: string;
  landingURL: string;
  softwareVersion: string;
  legal: {
    license: string;
  };
  publiccodeYml: string;
};
