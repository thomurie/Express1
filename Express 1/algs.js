class Maths {
  constructor(arr, num) {
    this.arr = arr;
    this.num = num;
  }
  mean() {
    return this.num / this.arr.length;
  }

  median() {
    if (this.arr.length % 2 === 1) {
      return this.arr[Math.floor(this.arr.length / 2)];
    }
    const temp =
      this.arr[this.arr.length / 2 - 1] + this.arr[this.arr.length / 2];
    return temp / 2;
  }

  findMode() {
    const numDic = {};
    this.arr.forEach((element) => {
      if (numDic[`${element}`] === undefined) {
        numDic[`${element}`] = 1;
      } else {
        numDic[`${element}`]++;
      }
    });
    let most = [0, 0];
    const values = Object.entries(numDic);
    values.forEach((e) => {
      if (e[1] > most[1]) most = e;
    });
    return most[0];
  }

  bubbleSort() {
    for (let i = 0; i < this.arr.length; i++) {
      const element = this.arr[i];
      const element2 = this.arr[i + 1];
      if (element > element2) {
        [element, element2] = [element2, element];
      }
      return this.arr;
    }
  }
}

module.exports = Maths;
