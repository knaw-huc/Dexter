declare module 'citation-js' {
  class Cite {
    static async(data: string): Promise<Cite>;

    constructor(date: string);

    format(
      type: 'bibliography',
      config: {
        format: 'html';
        template: 'citation-apa';
        lang: 'en-US';
      },
    ): string;
  }

  export = Cite;
}
