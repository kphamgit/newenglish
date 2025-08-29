
import { store } from '../redux/store/store';
function log(message: string, content?: any) {
  //const date = new Date();
  //const timestamp = date.toISOString();
  //console.log("number of logging arguments = ", arguments.length);
  
  const log_id = store.getState().logID.value
  if (arguments.length === 2) {
    console.log(log_id, ` ${message}`, content);
    return;
  }
  else {
    console.log(log_id, ` ${message}`);
  }
}

export default log;