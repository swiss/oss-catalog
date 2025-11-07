export type Software = {
  id: string;
  name: string;
  landingURL: string;
  softwareVersion: string;
  legal: {
    license: string;
  };
  publiccodeYml: string;
};
