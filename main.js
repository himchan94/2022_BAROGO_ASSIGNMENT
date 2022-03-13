class Vm {
  constructor(productList, changes) {
    this.prouducts = productList;
    this.changes = changes;
    this.money = 0;
    this.method = null;
  }

  selectMethod(method) {
    this.method = method;
    console.log(`결제방식 @ ${this.method}`);
  }

  inputMoney(inputMoney) {
    console.log(`${inputMoney}원이 투입되었습니다.`);
    this.money += inputMoney;
  }

  buyDrink(drink) {
    if (!this.prouducts[drink]) {
      console.log("상품을 확인해주세요");
      return;
    }

    if (!this.method) {
      console.log("결제방법을 선택해주세요");
      return;
    }

    if (this.method === "현금") {
      const price = this.prouducts[drink].price;

      if (!this.checkSufficient(drink)) return;

      if (!this.checkAvailable(drink)) return;

      if (!this.checkChange(this.money - price)) return;

      this.prouducts[drink].amount -= 1;
      this.money -= price;
      console.log(`${drink} 나왔습니다 @ 잔액 ${this.money}`);
      return;
    }

    if (this.method === "카드") {
      if (!this.checkCard()) return;
      if (!this.checkAvailable(drink)) return;
      this.prouducts[drink].amount -= 1;
      console.log(`${drink} 나왔습니다 @ 카드구매`);
      return;
    }
  }

  checkSufficient(drink) {
    const price = this.prouducts[drink].price;
    if (this.money < price) {
      console.log(`잔액이 부족합니다 @ 부족한 금액 : ${price - this.money}원`);
      return false;
    }
    console.log("잔액이 충분합니다");
    return true;
  }

  checkChange(changes) {
    const copy = { ...this.changes };
    const keys = Object.keys(copy).reverse();

    let returnMoney = changes;

    for (const coin of keys) {
      const amount = parseInt(returnMoney / Number(coin));
      const currentAmount = copy[coin].amount;
      const gap = currentAmount - amount;

      if (currentAmount === 0) {
        continue;
      } else {
        if (gap < 0) {
          copy[coin].amount = 0;
          returnMoney -= Number(coin) * currentAmount;
        } else {
          copy[coin].amount = gap;
          returnMoney %= coin;
        }
      }
    }

    if (returnMoney !== 0) {
      console.log("거스름 돈이 부족합니다");
      return false;
    }

    console.log("거스름 돈이 충분합니다");
    this.changes = { ...copy };
    return true;
  }

  checkAvailable(selection) {
    const amount = this.prouducts[selection].amount;
    if (amount === 0) {
      console.log("음료 재고가 없습니다");
      return false;
    }
    console.log("음료 재고가 있습니다");
    return true;
  }

  checkCard() {
    console.log("사용가능한 카드입니다.");
    return true;
  }

  returnMoney() {
    console.log(`${this.money}원이 반환되었습니다.`);
    this.money = 0;
    this.method = null;
  }

  removeCard() {
    console.log(`카드가 반환되었습니다.`);
    this.method = null;
  }
}

/* 실행 코드 */

const ITEMS = {
  콜라: { price: 1100, amount: 10 },
  물: { price: 600, amount: 10 },
  커피: { price: 700, amount: 10 },
};

const CHANGES = {
  100: { amount: 10 },
  500: { amount: 10 },
  1000: { amount: 10 },
  5000: { amount: 10 },
  10000: { amount: 10 },
};

/* 자핀기 인스턴스 생성 */
const firstVm = new Vm(ITEMS, CHANGES);

// 현금구매

firstVm.selectMethod("현금");
firstVm.inputMoney(1300);
firstVm.buyDrink("콜라");
firstVm.returnMoney();

// 카드구매

/*
firstVm.selectMethod("카드");
firstVm.buyDrink("콜라");
firstVm.removeCard();
*/
