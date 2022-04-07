import { GameObject, Mark } from "../models/game";

export const calculateWin = (field: GameObject[], mark: Mark): number[] | undefined => {
  let res: number[] | undefined;
  res = tryToTakeWinner(field, mark, [0, 1, 2]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [3, 4, 5]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [6, 7, 8]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [0, 3, 6]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [1, 4, 7]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [2, 5, 8]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [0, 4, 8]);
  if (res) {
    return res;
  }

  res = tryToTakeWinner(field, mark, [2, 4, 6]);
  if (res) {
    return res;
  }

  return undefined;
}

const tryToTakeWinner = (field: GameObject[], mark: Mark, [index1, index2, index3]: number[]): number[] | undefined => {
  if (field[index1].mark === mark && field[index2].mark === mark && field[index3].mark === mark) {
    return [index1, index2, index3];
  }

  return;
}