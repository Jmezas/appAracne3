import { getCurrentDate } from "./dates.utils";

export const hashCodeString = (value: string) => {
  var h = 0,
    l = value.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + value.charCodeAt(i++)) | 0;
  return h;
};

export const escaparComas = (text: string) => {
  return text == null || text=="" ? "" : text.replace(",", "|");
}

export const generateQuestionMark = (ls: Array<any>) => {
  let values = '';
  ls.forEach(item => {
    values = values+'?,'
  });
  return values.slice(0, -1)
}

export const generatePhotoName = (itemId: string) => {
  const dateNow = getCurrentDate("YYYY_MM_DD_HHmmssSSS");
  return `${itemId}_${dateNow}.jpg`;
}
