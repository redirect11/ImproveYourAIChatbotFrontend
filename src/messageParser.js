import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    console.log('MessageParser', message);
      actions.handleUserMessage(message);
  };

  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </>
  );
};

export default MessageParser;