import Colors from "../../static/colors";
import React from "react";
import Button from "../atoms/button";
import Svg from "../atoms/svg";

type LogoProps = {
  path: string;
};

class Logo extends React.Component<LogoProps, Record<string, never>> {
  render() {
    const path = this.props.path;
    return (
      <Button className={`justify-center flex-shrink-0 w-full h-16 mt-4`}>
        <Svg className={`h-10 w-10`} color={Colors.TEXT_2} path={path} />
      </Button>
    );
  }
}

export default Logo;
