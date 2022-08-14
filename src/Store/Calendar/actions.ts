export const GET_DATE = "GET_DATE";

export const getDate = (date:Date) => ({
    type: GET_DATE,
    payload: date
  });