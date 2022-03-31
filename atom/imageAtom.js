import { atom } from "recoil";

const imageState = atom({
  key: "imageAtom", // unique ID (with respect to other atoms/selectors)
  default: "user@gmail.com", // default value (aka initial value)
});

export default imageState;
