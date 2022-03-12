const NUMBER_OF_INITIAL_POPULATION = 4
const NUMBER_OF_ITERATIONS = 5
const MUTATION_RATE = 0.01
const CROSSOVER_RATE = 0.7

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
  if (Math.random() < CROSSOVER_RATE) {
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

const makeMutation = (specimenBit) => {
  if (Math.random() < MUTATION_RATE) {
    specimenBit = specimenBit === '0' ? '1' : '0'
  }
  return specimenBit
}

const runMutation = (newSpecimens) => {
  const newSpecimensMutation = newSpecimens.map((specimen) => {
    let specimenModified = ''
    for (let i = 0; i < specimen.length; i++) {
      specimenModified += makeMutation(specimen[i])
    }
    return specimenModified
  })

  return newSpecimensMutation
}

const runCrossover = (firstChosen, secondChosen) => {
  const newSpecimens = makeCrossover(firstChosen, secondChosen)

  if (newSpecimens == null) return false

  else {
    const newSpecimensMutation = runMutation(newSpecimens)
    const newPopulation = [
      firstChosen,
      secondChosen,
      {
        decimalSpecimen: parseInt(newSpecimensMutation[0], 2),
        binarySpecimen: newSpecimensMutation[0],
        objectiveFunctionValue: objectiveFunction(parseInt(newSpecimensMutation[0], 2))
      },
      {
        decimalSpecimen: parseInt(newSpecimensMutation[1], 2),
        binarySpecimen: newSpecimensMutation[1],
        objectiveFunctionValue: objectiveFunction(parseInt(newSpecimensMutation[1], 2))
      }
    ]
    return newPopulation
  }
}

const initialPopulation = () => {
  const population = [];
  for (let i = 0; i < NUMBER_OF_INITIAL_POPULATION; i++) {
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

const generateHead = () => {
  const table = document.createElement('table')
  table.className = 'table'

  const tHead = document.createElement('thead')
  const trHead = document.createElement('tr')
  trHead.className = 'trHead'
  const thChromosome = document.createElement('th')
  thChromosome.textContent = 'Chromosome'
  const thX = document.createElement('th')
  thX.textContent = 'X'

  trHead.appendChild(thChromosome)
  trHead.appendChild(thX)
  tHead.appendChild(trHead)
  table.appendChild(tHead)

  return table
}

const generateBody = (population) => {
  const tBody = document.createElement('tbody')

  population.forEach((specimen) => {
    const tr = document.createElement('tr')
    const tdChromosome = document.createElement('td')
    tdChromosome.textContent = specimen.binarySpecimen
    const tdX = document.createElement('td')
    tdX.textContent = specimen.decimalSpecimen

    tr.appendChild(tdChromosome)
    tr.appendChild(tdX)
    tBody.appendChild(tr)
  })

  return tBody
}

const render = (allPopulation) => {
  const container = document.getElementById('container')
  let i = 0
  allPopulation.forEach((population) => {
    const family = document.createElement('caption')
    family.textContent = `Generation ${i}`
    const table = generateHead(container)
    const tBody = generateBody(population)

    table.appendChild(tBody)
    table.appendChild(family)
    container.appendChild(table)
    i += 1
  })
}

function init() {
  let i = 1
  const allPopulation = []

  const population = initialPopulation()
  allPopulation.push(population)

  do {
    const populationWithProbability = getProbability(allPopulation[i - 1])

    const firstChosen = tournamentSelection(populationWithProbability)
    const populationWithoutFirst = populationWithProbability.filter((element) => element !== firstChosen)
    const secondChosen = tournamentSelection(populationWithoutFirst)

    const crossover = runCrossover(firstChosen, secondChosen, populationWithProbability)

    const newPopulation = crossover ? crossover : [firstChosen, secondChosen, firstChosen, secondChosen]
    allPopulation.push(newPopulation)
    i += 1
  } while (i < NUMBER_OF_ITERATIONS)

  render(allPopulation)
}

init()
