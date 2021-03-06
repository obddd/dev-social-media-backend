import { alertActionTypes } from './alert.action.types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: alertActionTypes.SET_ALERT,
    payload: { msg, alertType, id },
  });
  setTimeout(
    () =>
      dispatch({
        type: alertActionTypes.REMOVE_ALERT,
        payload: id,
      }),
    2500
  );
};
