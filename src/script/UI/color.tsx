declare const colorNominality: unique symbol;
type color = string & { [colorNominality]: never };

const isColor = (value: string): value is color => {
  return /^((transparent|current|black|white)|((gray|red|yellow|green|blue|indigo|purple)-(5|10|20|30|40|50|60|70|80|90)0))$/.test(value);
};
