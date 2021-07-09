import React, { useEffect } from "react";
import { useHistory } from "react-router";
import firebase from "../auth/firebase";

export default function Screen({ children, auth }) {
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && auth) {
        history.push("/");
      }
    });
  }, [history, auth]);
  return <div>{children}</div>;
}
