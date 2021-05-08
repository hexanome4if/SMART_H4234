import constants from '../constants';

const computeHttpResponse = async (response) => {
  let json;
  let status = 'ok';
  if (response.status === 200) {
    json = await response.json();
  } else if (response.status === 403) {
    status = 'forbidden';
  } else {
    status = 'internal';
  }
  return { json, status };
};

const getUser = async (token, userName) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);

  try {
    const response = await fetch(`${constants.apiUrl}/user/${userName}`, {
      method: 'GET',
      headers,
    });
    return await computeHttpResponse(response);
  } catch (err) {
    console.error(err);

    return {
      status: 'internal',
      json: undefined,
    };
  }
};

const login = async (userName, password, deviceToken) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  try {
    console.log('Sending token', deviceToken);
    const response = await fetch(`${constants.apiUrl}/login`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ userName, password, device: deviceToken }),
    });
    return await computeHttpResponse(response);
  } catch (err) {
    console.error(err);
    return {
      status: 'internal',
      json: undefined,
    };
  }
};

export default {
  getUser,
  login,
};
