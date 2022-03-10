const numberOfInitialPopulation = 4
const numberOfIterations = 5

const objectiveFunction = (x) => {
  return Math.pow(x, 2) - (3 * x) + 4
}

const getProbability = (population) => {
  const sumFx = population.reduce((acc, _, index) => {
    return acc + population[index].objectiveFunctionValue
  }, 0)

  const populationWithProbability = population.map((specimen) => {
    return {
      ...specimen,
      probability: specimen.objectiveFunctionValue / sumFx
    }
  })

  return populationWithProbability
}

const tournamentSelection = (population) => {
  const firstChosen = population[Math.floor(Math.random() * population.length)]
  const secondChosen = population[Math.floor(Math.random() * population.length)]

  return firstChosen.objectiveFunctionValue > secondChosen.objectiveFunctionValue ? firstChosen : secondChosen
}

const initialPopulation = () => {
  const population = [];
  for (let i = 0; i < numberOfInitialPopulation; i++) {
    let number = Math.random() * (10 - (-10)) + (-10);
    number = Math.ceil(number)
    if (number < 0) {
      number = number * -1
      population.push(
        {
          decimalSpecimen: number,
          binarySpecimen: '1' + number.toString(2).padStart(4, '0'),
          objectiveFunctionValue: objectiveFunction(number)
        }
      )
    } else {
      population.push(
        {
          decimalSpecimen: number,
          binarySpecimen: '0' + number.toString(2).padStart(4, '0'),
          objectiveFunctionValue: objectiveFunction(number)
        }
      )
    }
  }
  return population;
}

function init() {
  const population = initialPopulation()
  const populationWithProbability = getProbability(population)

  const firstChosen = tournamentSelection(populationWithProbability)
  const populationWithoutFirst = populationWithProbability.filter((element) => element !== firstChosen)
  const secondChosen = tournamentSelection(populationWithoutFirst)

  console.log(firstChosen)
  console.log(secondChosen)
}
init()
