import { atom } from "recoil";

const lastSeenState = atom({
  key: "lastSeenAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default lastSeenState;
