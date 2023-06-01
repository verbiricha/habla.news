import { names, getNIP95names } from "@habla/nip05";


export default  function handler(req, res) {

  console.log( getNIP95names());

  res.status(200).json({ names });
}
