import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

const ChatbotHeader = ( { selectedAssistant } ) => {

  const headerColor = useMemo(() => {
   let headerColorFrom = "from-[#e0aa6c]";
   let headerColorTo = " to-[#423827]";
    console.log('selectedAssistant:', selectedAssistant);
  let assistantRole = selectedAssistant?.metadata?.roles;
  //split string by |
  assistantRole = assistantRole.split('|');
  if(assistantRole.includes("non_registrato") || assistantRole.includes("registrato")) {
    headerColorFrom = "bg-gradient-to-b from-green-300";
    headerColorTo = " to-slate-900";
  } else if(assistantRole.includes("cliente")) {
    headerColorFrom = "bg-gradient-to-b from-red-500";
    headerColorTo = " to-slate-900";
  } else if(assistantRole.include("abbonato")) {
    headerColorFrom = "from-[#e0aa6c]";
    headerColorTo = " to-[#423827]";
  } else {
    headerColorFrom = "bg-gradient-to-b from-neutral-500";
    headerColorTo = " to-slate-900";
  }

  console.log('headerColorFrom:', headerColorFrom);
  console.log('headerColorTo:', headerColorTo);


   return headerColorFrom + headerColorTo;
  }, [selectedAssistant]);

  return (
    <div className={twMerge(`react-chatbot-kit-chat-header`, `bg-gradient-to-b ${headerColor}`)}>
      {selectedAssistant ? selectedAssistant.name : "Chatbot"}
    </div>
  );
 };

export default ChatbotHeader;
