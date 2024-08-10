import React from "react";

import GeneralOptions from "../options/GeneralOptions/GeneralOptions";

const Overview = (props) => {
  return (
    <div>
      <GeneralOptions actionProvider={props.actionProvider} options={props.assistants} onAssistantSelected={props.onAssistantSelected} {...props} />
    </div>
  );
};

export default Overview;