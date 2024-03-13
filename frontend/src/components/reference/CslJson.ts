export type CslJson = {
  author: { family: string }[];
  title: string;
  issued: { ['date-parts']: number[][] };
  id?: string;
}[];
