declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.html?raw' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.css' {}

declare module '*.scss' {}

declare module '*.sass' {}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '@core-js/alert' {
  export default class Alert {
    init(root?: ParentNode): Alert;
    destroy(): void;
  }
}

declare module '@core-js/table' {
  export default class Table {
    init(root?: ParentNode): void;
    destroy(): void;
  }
}

declare module '@core-js/dropdown' {
  export default class Dropdown {
    init(root?: ParentNode): Dropdown;
    destroy(): void;
  }
}

declare module '@core-js/flyout' {
  export default class Flyout {
    init(root?: ParentNode): Flyout;
    destroy(): void;
  }
}

declare module '@core-js/modal' {
  export default class Modal {
    init(root?: ParentNode): Modal;
    destroy(): void;
  }
}

declare module '@core-js/*' {
  const CoreComponent: new () => { init(): void };
  export default CoreComponent;
}
