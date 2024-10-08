import  React from "react";

const Options = (props) => {

    const { options, actionProvider, onAssistantSelected } = props

    console.log(options);
    const setAssistant = async (assistant) => {
        onAssistantSelected(assistant);
        actionProvider.handleAssistantChoice(assistant);
    };

    const markup = options.map((option) => (
        <button key={option.id} onClick={() => setAssistant(option)}>
        {option.name}
        </button>
    ));

    return <div>{markup}</div>;
};

export default Options;