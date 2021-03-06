import { authActionTypes } from './auth.action.types';
import { profileActionTypes } from '../profile/profile.action.types';
import axios from 'axios';
import { setAlert } from '../alert/alert.action';
import setAuthToken from './auth.utils';

//Load User
export const loadUser = () => async (dispatch) => {
    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: authActionTypes.USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: authActionTypes.AUTH_ERROR
        })
    }
}

//Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: authActionTypes.REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: authActionTypes.REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: authActionTypes.LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: authActionTypes.LOGIN_FAIL
    });
  }
};

//Logout
export const logout = () => async (dispatch) => {
  dispatch({
    type: profileActionTypes.CLEAR_PROFILE,
  });
  dispatch({
    type: authActionTypes.LOGOUT,
  });
};

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This cannot be undone')) {
    try {
      await axios.delete('/api/profile');
      dispatch({ type: profileActionTypes.CLEAR_PROFILE });
      dispatch({ type: authActionTypes.ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: profileActionTypes.PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};