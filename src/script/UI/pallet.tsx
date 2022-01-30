class Pallet {
  readonly light: color;
  readonly dark: color;
  constructor(light: color, dark: color) {
    this.light = light;
    this.dark = dark;
  }
  toString(type: "bg" | "text" | "border", prefix?: string) {
    return `${prefix ? prefix + ":" : ""}${type}-${this.light} dark:${prefix ? prefix + ":" : ""}${type}-${this.dark}`;
  }
}

export default Pallet;
