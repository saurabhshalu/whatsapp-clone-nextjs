import { atom } from "recoil";

const loadingState = atom({
  key: "loadingAtom", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export default loadingState;
