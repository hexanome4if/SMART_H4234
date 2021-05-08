import constants from '../../constants';

export const getAvatar = async (userId, token) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);

  const response = await fetch(`${constants.apiUrl}/avatar/${userId}`, {
    method: 'GET',
    headers,
  });

  if (response.status === 200) {
    const txt = await response.text();
    return `https://i.imgur.com/${txt}`;
  }
  return null;
};
