export const validateItem = (id,user) => {
    let resp = null;
  
    if (user._id || user.id) {
      resp = id.localeCompare(user._id || user.id) === 0;
    }
    return resp;
  };



  import { useState, useRef, useEffect } from 'react';

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
