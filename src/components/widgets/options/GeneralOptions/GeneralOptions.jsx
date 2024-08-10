import React from "react";
import Options from "../Options/Options";

const GeneralOptions = (props) => {
  return <Options options={props.options} onAssistantSelected={props.onAssistantSelected} {...props} />;
};

export default GeneralOptions;