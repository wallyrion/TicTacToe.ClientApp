import { GameObject, Mark } from "../models/game";

export const createField = () => {
  var list: GameObject[] = [];
  for (var i = 0; i < 9; i++) {
    var obj = {
      mark: Mark.NA
    }
    list.push(obj);
  }
  return list;
}