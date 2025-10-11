import React from "react";
import CustomTooltip from "../CustomTooltip";
import { Button } from "../ui/button";

const DisabledMessageButton = ({ classname }: { classname?: string }) => {
  return (
    <CustomTooltip title="you can only message your friends" position="bottom">
      <Button className={classname} type="button">
        Message
      </Button>
    </CustomTooltip>
  );
};

export default DisabledMessageButton;
