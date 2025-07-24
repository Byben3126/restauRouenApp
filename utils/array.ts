import { Float } from "react-native/Libraries/Types/CodegenTypes";

export const arraysSimpleEqual = (arrayA:Array<number | string | Float | boolean>, arrayB:Array<number | string | Float | boolean>) => {
    arrayA = arrayA.sort()
    arrayB = arrayB.sort()

    if (arrayA === arrayB) return true;
    if (arrayA == null || arrayB == null) return false;
    if (arrayA.length !== arrayB.length) return false;

    return arrayA.every((value, index) => value === arrayB[index]);
} 