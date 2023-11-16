import { atom } from 'recoil';

export const JsonDataAtom = atom({
  key: 'JsonDataAtom',
  default: [],
});

export const selectColumnAtom = atom({
  key: 'selectColumnAtom', // unique ID (with respect to other atoms/selectors)
  default: '',
});
