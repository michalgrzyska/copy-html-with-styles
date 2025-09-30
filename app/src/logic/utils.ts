export class Utils {
  static getObjectsDiff(obj1: Record<any, any>, obj2: Record<any, any>): Record<any, any> {
    const result = {} as Record<any, any>;

    Object.keys(obj1).forEach((key) => {
      if (obj1[key] !== obj2[key]) {
        result[key] = obj2[key];
      }
    });

    return result;
  }
}
