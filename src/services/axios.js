import queryString from 'qs';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_serverUrl;

const DEFAULT_OPTIONS = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

function _fetch(
  method,
  path,
  { qs = null, data = {} } = {},
  token,
  isFormData,
  isFile
) {
  let url = BASE_URL + path;

  if (qs) {
    url += `?${queryString.stringify(qs)}`;
  }

  const fileHeader = isFile
    ? {
        headers: {
          ...DEFAULT_OPTIONS.headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    : null;

  const authHeader = token
    ? {
        headers: {
          ...DEFAULT_OPTIONS.headers,
          'x-access-token': `${token}`
        }
      }
    : null;

  const req = {
    method,
    url,
    ...DEFAULT_OPTIONS,
    ...fileHeader,
    ...authHeader,
    ...data
  };

  if (method !== 'GET' && data) {
    req.data = isFormData ? data : JSON.stringify(data);
  }

  return axios(req);
}

export function getRequest(path, { qs = null, data = {} } = {}, token) {
  return _fetch('GET', path, { qs, data }, token);
}

export function postRequest(
  path,
  { qs = null, data = {} } = {},
  token,
  isFormData,
  isFile = false
) {
  return _fetch('POST', path, { qs, data }, token, isFormData, isFile);
}

export function patchRequest(path, { qs = null, data = {} } = {}, token) {
  return _fetch('PATCH', path, { qs, data }, token);
}

export function putRequest(path, { qs = null, data = {} } = {}, token) {
  return _fetch('PUT', path, { qs, data }, token);
}

export function deleteRequest(path, { qs = null, data = {} } = {}, token) {
  return _fetch('DELETE', path, { qs, data }, token);
}
