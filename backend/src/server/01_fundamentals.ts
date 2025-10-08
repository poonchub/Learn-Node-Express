// run: node --loader ts-node/esm src/main/01_fundamentals.ts

// let / const
let count: number = 0
const PI: number = 3.14

// ==============================================================

// arrow function
const add = (a: number, b: number): number => a + b

// ==============================================================

// destructuring
const person = { name: 'Mina', age: 25 }
const { name, age } = person
console.log(name, age)

// ==============================================================

// Async/Await + Promises
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function sayHello() {
  await delay(1000)
  console.log('Hello after 1 second')
}
sayHello()

// ==============================================================