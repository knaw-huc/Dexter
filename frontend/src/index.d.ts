declare module 'citation-js' {
  class Cite {
    static async(data: string): Promise<Cite>;

    constructor(date: string);

    format(
      type: 'bibliography' | 'citation',
      config: {
        format: 'html';
        template: string;
        lang: 'en-US';
      },
    ): string;
  }

  export = Cite;
}
