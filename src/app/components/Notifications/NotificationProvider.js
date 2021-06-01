import React, { createContext, useContext, useReducer } from "react";
import {v4} from "uuid";
import Notification from "./Notification";

const NotificationContext = createContext();

const NotificationProvider = (props) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.action) {
      case "ADD_NOTIFICATION":
        return [action.payload];
      case "REMOVE_NOTIFICATION":
        return []
      default:
        return state
    }
  }, []);

  return(
    <NotificationContext.Provider value={dispatch}>
      <div className={"NotifyWrapper"}>
        {state.map((note) => {
          return <Notification dispatch={dispatch} key={note.id} {...note} />
        })}
      </div>
      {props.children}
    </NotificationContext.Provider>
  )
};

export const useNotification = () => {
  const dispatch = useContext(NotificationContext);
  return (props) => {
    if(props.action === "ADD_NOTIFICATION"){
      dispatch({
        action: props.action,
        payload: {
          id: v4(),
          ...props
        }
      })
    }
    else{
      dispatch({
        action: "REMOVE_NOTIFICATION"
      })
    }
    
  }
};

export default NotificationProvider;