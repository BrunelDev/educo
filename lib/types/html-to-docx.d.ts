// types/html-to-docx.d.ts
declare module 'html-to-docx' {
  interface TableOptions {
    row?: {
      cantSplit?: boolean;
    };
  }

  interface MarginOptions {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  interface HTMLtoDOCXOptions {
    table?: TableOptions;
    footer?: boolean;
    pageNumber?: boolean;
    font?: string;
    fontSize?: number;
    complexScriptFont?: string;
    tableRowSeparator?: string;
    lineNumber?: boolean;
    lang?: string;
    orientation?: 'portrait' | 'landscape';
    margins?: MarginOptions;
  }

  function HTMLtoDOCX(
    htmlString: string,
    header?: string | null,
    options?: HTMLtoDOCXOptions
  ): Promise<Buffer>;

  export = HTMLtoDOCX;
}