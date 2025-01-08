import { StyleConfig } from './types';

const styleConfig: StyleConfig = {
  heading1: {
    run: {
      size: 36,
      bold: true,
      color: "000000",
    },
    paragraph: {
      spacing: {
        before: 240,
        after: 120,
      },
      alignment: "CENTER",
    },
  },
  heading2: {
    run: {
      size: 28,
      bold: true,
      color: "000000",
    },
    paragraph: {
      spacing: {
        before: 240,
        after: 120,
      },
      alignment: "LEFT",
    },
  },
  heading3: {
    run: {
      size: 24,
      bold: true,
      color: "000000",
    },
    paragraph: {
      spacing: {
        before: 240,
        after: 120,
      },
      alignment: "LEFT",
    },
  },
  normal: {
    run: {
      size: 24,
      color: "000000",
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "LEFT",
    },
  },
  quote: {
    run: {
      size: 24,
      color: "000000",
      italics: true,
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "LEFT",
      indent: {
        left: 720,
        right: 720,
      },
    },
  },
  code: {
    run: {
      size: 20,
      font: "Courier New",
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "LEFT",
    },
  },
  footnote: {
    run: {
      size: 20,
      superScript: true,
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "LEFT",
    },
  },
  caption: {
    run: {
      size: 20,
      italics: true,
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "CENTER",
    },
  },
  tableHeader: {
    run: {
      size: 24,
      bold: true,
      color: "000000",
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "CENTER",
    },
  },
  tableCell: {
    run: {
      size: 24,
      color: "000000",
    },
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
      alignment: "LEFT",
    },
  },
};

export default styleConfig;