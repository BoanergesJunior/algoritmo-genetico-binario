const numberOfInitialPopulation = 4
const numberOfIterations = 5

const objectiveFunction = (x) => {
  return Math.pow(x, 2) - (3 * x) + 4
}

const initialPopulation = () => {
  const population = [];
  for (let i = 0; i < numberOfInitialPopulation; i++) {
    let number = Math.random() * (10 - (-10)) + (-10);
    number = Math.ceil(number)
    console.log(number)
    if (number < 0) {
      number = number * -1
      population.push('1' + number.toString(2).padStart(4, '0'))
    } else {
      population.push('0' + number.toString(2).padStart(4, '0'))
    }
  }
  return population;
}

console.log(objectiveFunction(-4.3))
