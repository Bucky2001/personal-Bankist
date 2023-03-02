'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let currentAccount;
/////////////////////////////////////////////////
// Functions
const creatUserNames = function (acc) {
  acc.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');
  });
};

creatUserNames(accounts);

const displayMovements = function (acc, sort = false) {
  // let cal = 0;
  // console.log(acc);
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  // displayBalance(movements);
  mov.forEach(function (mov, i) {
    const action = mov < 0 ? 'withdrawal' : 'deposit';
    const now = new Date(acc.movementsDates[i]);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${action}">${
      i + 1
    } ${action}</div>
    <div class="movements__date">${`${now.getDate()}/${
      now.getMonth() + 1
    }/${now.getFullYear()}`}</div>
    <div class="movements__value">${mov.toFixed(2)}$</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // cal += mov;
  });
  // labelBalance.textContent = cal;
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((ac, cr) => ac + cr, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} $`;
};

const calcDisplaySummery = function (acco) {
  labelSumIn.textContent = `${acco.movements
    .filter(arr => arr > 0)
    .reduce((ac, val) => ac + val, 0)
    .toFixed(2)}$`;
  labelSumOut.textContent = ` ${Math.abs(
    acco.movements.filter(arr => arr < 0).reduce((ac, val) => ac + val, 0)
  ).toFixed(2)}$`;
  // const interest = arr.interestRate;
  labelSumInterest.textContent = `${acco.movements
    .filter(arr => arr > 0)
    .map(arr => (arr * acco.interestRate) / 100)
    .filter(arr => arr >= 1)
    .reduce((ac, arr) => ac + arr, 0)
    .toFixed(2)}$`;
};

const updateUI = function (array) {
  displayMovements(array);
  displayBalance(array);
  calcDisplaySummery(array);
};

// currentAccount = accounts[0];
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    arr => arr.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    sort = false;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);

    containerApp.style.opacity = 100;
    const now = new Date();
    labelDate.textContent = `${new Intl.DateTimeFormat('en-IN').format(
      new Date()
    )}, ${now.getHours()}:${now.getMinutes()}`;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    recieverAcc &&
    recieverAcc?.userName != currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  } else console.log('transfer not success');
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  // const maxDeposit = currentAccount.movements.reduce(
  //   (acc, max) => (acc < max ? max : acc),
  //   currentAccount.movements[0]
  // );
  inputLoanAmount.value = '';
  //   if (loanAmount > 0 && maxDeposit > loanAmount * 0.1) {
  //     currentAccount.movements.push(loanAmount);
  //     updateUI(currentAccount);
  //}
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(max => max >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    const now = new Date();
    currentAccount.movementsDates.push(now.toISOString());
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => (acc.userName = currentAccount.userName)
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sort = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sort);
  sort = !sort;
});

// const now = new Date();
// labelDate.textContent = `${now.getDate()}/${
//   now.getMonth() + 1
// }/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`;
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(new Intl.DateTimeFormat('en-IN').format(new Date()));
