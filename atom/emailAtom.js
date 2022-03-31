import { atom } from "recoil";

const emailState = atom({
  key: "emailAtom", // unique ID (with respect to other atoms/selectors)
  default: "user@gmail.com", // default value (aka initial value)
});

export default emailState;
