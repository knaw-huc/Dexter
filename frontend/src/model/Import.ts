export type ResultDublinCoreMetadata = Record<string, string>;

export type ResultImport = {
  isValidExternalReference: boolean;
  imported?: ResultDublinCoreMetadata;
};
