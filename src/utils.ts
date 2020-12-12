/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line import/prefer-default-export
export const getTypedKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
