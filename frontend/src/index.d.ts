type StyleConfig = {
  templates: {
    add(styleName: string, styleData: string): void;
  };
};

declare module 'citation-js' {
  class Cite {
    static async(data: string): Promise<Cite>;

    constructor(date: string);

    format: (
      type: 'bibliography' | 'citation' | 'bibtex' | 'data',
      config?: {
        format: 'html' | 'object';
        template?: 'apa' | 'vancouver' | 'harvard1' | 'chicago';
        lang?: 'en-US';
      },
    ) => string | import('./components/citation/CslJson').CslJson;

    static plugins: {
      config: {
        get(styleConfig: string): StyleConfig;
      };
    };

    static util: {
      fetchFile(url: string): string;
    };
  }

  export = Cite;
}
