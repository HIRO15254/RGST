import Pallet from "../script/UI/pallet";

class Colors {
  static readonly THEME_1 = new Pallet("white" as color, "gray-900" as color);
  static readonly THEME_2 = new Pallet("gray-300" as color, "gray-800" as color);
  static readonly THEME_3 = new Pallet("gray-500" as color, "gray-700" as color);
  static readonly WARN_NOAMAL = new Pallet("red-500" as color, "red-600" as color);
  static readonly LINK_NOAMAL = new Pallet("indigo-500" as color, "indigo-500" as color);
  static readonly TEXT_1 = new Pallet("gray-900" as color, "gray-100" as color);
  static readonly TEXT_2 = new Pallet("gray-700" as color, "gray-300" as color);
}

export default Colors;
