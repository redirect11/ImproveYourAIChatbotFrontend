import React, {useEffect, useState} from 'react';
import useSWR from 'swr';
import { createCustomMessage, createClientMessage } from "react-chatbot-kit";
import moment from 'moment';
import { useDispatch} from 'react-redux';
import { setHandover } from './redux/slices/HandoverSlice';

const fetcher = (url) => fetch(url).then((res) => res.json());

const ActionProvider = ({  setState, state, children }) => {

  const dispatch = useDispatch();	// Redux store dispatch
  const { data, error } = useSWR('/wp-json/video-ai-chatbot/v1/get-current-user-thread-messages', fetcher, { refreshInterval: state.isHandover ? 5000 : 10000 });

   useEffect(() => {
      console.log('config.state.isHandover:', state.isHandover);
      console.log('useEffect data:', data);
      if(data && data?.is_handover_thread) {
  
        console.log('data:', data);
        console.log('state:', state);
        let newMessages = data.messages.data.reverse();

        //get last message timestamp and if the last message timestamp is the same as the last message timestamp in the state, return
        console.log("last state message", state.messages[state.messages.length - 1].payload.created_at);
        console.log("last new messages", newMessages[newMessages.length - 1].created_at);
        if(state.messages.length > 0 
          && state.messages[state.messages.length - 1].payload.created_at >= newMessages[newMessages.length - 1].created_at
          && state.messages[state.messages.length - 1].payload.type === "loaderMessage") {
          return;
        }

        let filteredNewMessages = newMessages.filter((message) => {
          if(message.role === "user") {
            return false;
          } 
          if(state.messages[state.messages.length - 1].payload.created_at >= message.created_at) {
            return false;
          }
          return !state.messages.some((oldMessage) => { 
            return oldMessage?.payload?.originalId === message.id 
          }) 
        });

        console.log('filteredNewMessages1:', filteredNewMessages);

        filteredNewMessages = filteredNewMessages.map((message) => {
          return createCustomMessage(message.content[0].text.value, "customWithLinks", {
            payload: {
              message: message.content[0].text.value,
              originalId: message.id,
              created_at: message.created_at,
              is_handover_message: message?.metadata?.handover_message ? message.metadata.handover_message : false
            }
          });
        });
               
  
        console.log('filteredNewMessages2:', filteredNewMessages);
        setState(prevConfig => {
          return {
              ...prevConfig,
              messages: [...prevConfig.messages, ...filteredNewMessages],
              isHandover: data?.is_handover_thread ? data.is_handover_thread : false
            }
          });

        dispatch(setHandover(data.is_handover_thread));
        
      }
    }, [data]);


  const getSelectedAssistant = () => {
    return state.selectedAssistant;
  }

  const handleData = (data) => {

    console.log('handleData data:', data);
    let dataMessage = data.message.value;
    const widgetType = !data.message.value ? "customWithError" : "customWithLinks";
    if(!dataMessage) {
      dataMessage = "C'è stato un errore nella risposta del bot";
    } else if(dataMessage === "handover") {
      return;
    }
    const pattern = /【.*?†source】/g;
    // Replace the pattern with an empty string
    dataMessage = dataMessage.replace(pattern, '');
    const botMessage = createCustomMessage(dataMessage, widgetType, {
      payload: {
        message: dataMessage, 
        originalId: data.id,
        created_at: data.created_at,
        is_handover_message: data?.is_handover_message
      }
    });
    console.log('botMessage:', botMessage);
    console.log('handleData state:', state);
    //verificare se l'ultimo messaggio è di typo loader. Se si, rimuoverlo
    setState((prev) => {
      let newPrevMsg = prev.messages;
      if(newPrevMsg[newPrevMsg.length - 1].type === "loaderMessage") {
        newPrevMsg = prev.messages.slice(0, -1)
      }
      return {
        ...prev,
        messages: [...newPrevMsg, botMessage],
        isHandover: data?.is_handover_message ? data.is_handover_message : false
      }
    });
    dispatch(setHandover(data?.is_handover_thread ? data.is_handover_thread : false));
  }


  const handleUserMessage = (message) => {


    console.log("handleUserMessage state", state);

    setState((prev) => {
      let newPrevMsg = prev.messages;
      //get last message
      console.log('newPrevMsg:', newPrevMsg[newPrevMsg.length - 1]);
      newPrevMsg[newPrevMsg.length - 1].payload = { originalId: 0, created_at: moment().unix() };
      return {
        ...prev,
        messages: [...newPrevMsg],
      }
    });

    if(!state.isHandover) {
      const loading = createCustomMessage("" , "loaderMessage")
      setState((prev) => ({ ...prev, messages: [...prev.messages, loading], }))
    }

    if(!state.selectedAssistant && !state.isHandover) {
      console.log('No assistant selected');
      setState((prev) => {
        return {
          ...prev,
          messages: [...prev.messages, createCustomMessage("Seleziona un assistente", 
                                                        "customWithError", 
                                                        {payload: "Seleziona un assistente"})],
        }
      });
      return;
    }

    fetch('/wp-json/video-ai-chatbot/v1/chatbot/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message,
                             assistant_id: state.selectedAssistant.id})
    })
    .then(response => { return response.json()})
    .then(handleData);
  };

  const handleAssistantChoice = (selectedAssistant) => {
    console.log('assistant choice:', selectedAssistant);

    setState((prev) => ({
      ...prev,
      selectedAssistant: selectedAssistant,
    }));

    if(!state.isHandover) {
      const loading = createCustomMessage("", "loaderMessage")
      setState((prev) => ({ ...prev, messages: [...prev.messages, loading], }))
    }

    let message = 'Ciao'; //TODO remove hardocoded message

    fetch('/wp-json/video-ai-chatbot/v1/chatbot/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, //TODO remove hardocoded message
                             assistant_id: selectedAssistant.id,
                             postprompt: "true"})
    })
    .then(response => { return response.json()})
    .then(handleData);
  }

  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleAssistantChoice,
            handleUserMessage,
            getSelectedAssistant
          },
        });
      })}
    </>
  );
};

export default ActionProvider;