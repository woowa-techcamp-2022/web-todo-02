import { v4 as uuid } from 'uuid';

function getUniqueId() {
  const tokens = uuid().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

export default getUniqueId;
