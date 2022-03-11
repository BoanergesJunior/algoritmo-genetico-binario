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

const makeCrossover = (firstChosen, secondChosen) => {
  if (Math.random() < 0.7) {
    const random = Math.round(Math.random() * (4 - 1) + 1)
    const hold_1 = firstChosen.binarySpecimen.slice(0, random)
    const variant_1 = secondChosen.binarySpecimen.split('').slice(random).join('')

    const hold_2 = secondChosen.binarySpecimen.slice(0, random)
    const variant_2 = firstChosen.binarySpecimen.split('').slice(random).join('')

    const newSpecimen_1 = hold_1 + variant_1
    const newSpecimen_2 = hold_2 + variant_2

    return [newSpecimen_1, newSpecimen_2]
  }

  return null
}

const runCrossover = (firstChosen, secondChosen) => {
  const newSpecimens = makeCrossover(firstChosen, secondChosen)

  if (newSpecimens == null) return false
  else {
    const newPopulation = [
      firstChosen,
      secondChosen,
      {
        decimalSpecimen: parseInt(newSpecimens[0], 2),
        binarySpecimen: newSpecimens[0],
        objectiveFunctionValue: objectiveFunction(parseInt(newSpecimens[0], 2))
      },
      {
        decimalSpecimen: parseInt(newSpecimens[1], 2),
        binarySpecimen: newSpecimens[1],
        objectiveFunctionValue: objectiveFunction(parseInt(newSpecimens[1], 2))
      }
    ]
  }
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

  const crossover = runCrossover(firstChosen, secondChosen, populationWithProbability)

}
init()
