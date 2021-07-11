// pictionary game
// two teams, equal number of people on each team.
// fixed turnOrder, alternating between players of each team.
// there are a number of cards, each card has one word on it.
// during a turn, the player has the chance to score 0-3 points.
// when the cards run out, the round is over.

const cards = [
  'cat',
  'corolla',
  'crayon',
  'carp',
  'cadilac',
  'corn',
  'camping',
  'condo',
  'camera',
  'cardinal',
  'casino'
]
const users = {
  justin: {
    name: 'justin',
    multiplier: 2
  },
  erik: {
    name: 'erik',
    multiplier: 3
  },
  alex: {
    name: 'alex',
    multiplier: 2
  },
  brian: {
    name: 'brian',
    multiplier: 2.5
  },
  edward: {
    name: 'edward',
    multiplier: 1.22
  },
  matt: {
    name: 'matt',
    multiplier: 5/3
  }
};
const teams = {
  red: {
    users: ['justin', 'alex', 'erik']
  },
  blue: {
    users: ['brian', 'edward', 'matt']
  }
};
const turnOrder = ['edward', 'justin', 'matt', 'erik', 'brian', 'alex'];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const generateRandomGameData = (cards, users, teams, turnOrder, numberOfRounds) => {
  let turnOrderPosition = 0;
  // all of this is one function in order to share the state: `turnOrderPosition`.
 
  // iterate rounds
  return [...Array(numberOfRounds)].map(() => {

    // iterate on the number of `cards` rather than the `cards` array
    return [...Array(cards.length)].reduce(accum => {
      // console.log('accum: ', accum);

      if (turnOrderPosition > turnOrder.length - 1) {
        // start back at zero
        turnOrderPosition = 0;
      }

      const userTerms = getRandomInt(0, 3); 
      // console.log(`user will get ${userTerms} term(s)`);
      if (userTerms === 0) {
        return accum;
      }

      const scores = [...Array(userTerms)].reduce(accum1 => {
        // console.log('accum1: ', accum1);

        const remainingTerms = cards
          .filter(term => !Object.keys(accum1).includes(term));

        // console.log('remainingTerms: ', remainingTerms);
        const numberOfTermsRemaining = remainingTerms.length;
        if (numberOfTermsRemaining === 0) {
          // no terms remaining, bounce out to complete turn
          return { ...accum1 };
        }
        // console.log('numberOfTermsRemaining: ', numberOfTermsRemaining);  

        const nextTermx = getRandomInt(0, numberOfTermsRemaining - 1);
        // console.log('nextTermx:', nextTermx);  
        const nextTerm = remainingTerms[nextTermx]; 
        // console.log('nextTerm: ', nextTerm) 

        return {  ...accum1,  [nextTerm]: turnOrder[turnOrderPosition] };
      }, accum);

      // turn complete
      turnOrderPosition = turnOrderPosition + 1;
      return { ...accum, ...scores };
    }, {});
  });
}

const rounds = generateRandomGameData(cards, users, teams, turnOrder, 3);
// roundFormat: {
//     card: userThatScored
// };
// console.log('generated rounds: ', rounds);


// 1). Calculate the score of each round. Track the score per team and per user. Each card is worth 1 point, each user has a different score multiplier.
// 
// Data may be structured how ever you see fit. Here is one possibility:
// const exampleDataStructure = {
//   teamScores: {
//     blue: 6.22
//     red: 7
//   }, 
//   userScores: {
//     alex: 0,
//     brian: 0,
//     edward: 1.22,
//     erik: 3,
//     justin: 4,
//     matt: 5
//   }
// };

// 2). Calculate the final score of the game by summing all the rounds. Track score per team and per user.

// 3). Add something new. For example, some html to display the results, some data analysis on the rounds, or a change to the scoring system.



function playGame(rounds, users, teams) {
  const numOfRounds= 3;

  const getTeam = (user) => {
    // Search for user within teams and return first match.
    return Object.keys(teams).find((team) => teams[team]['users'].includes(user));
  }

  const roundNumber = (num) => {
    // Round number to ${num} decimal places
    const m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  let results = {
    teamScores: {},
    userScores: {},
    roundScores: {users: [], teams: []},
    otherStats: {failedCards: {}}
  }

  // The idea is to initialize all fields to 0 so that they can later be used to increment scores. 
  // I'm not sure if javascript allows any other way to automatically initialize the values
  // I could just add an `if` condition inside the loop below but it doesn't make sense to keep testing
  // for a specific condition that only happen once.
  Object.keys(users).forEach((user) => {
      results['userScores'][user] = 0.0;
      results['teamScores'][getTeam(user)] = 0.0;
  });
  
  [...Array(numOfRounds)].map((_, idx) => {
    results['roundScores']['users'][idx] = {...results['userScores']};
    results['roundScores']['teams'][idx] = {...results['teamScores']};
  });

  
  // In here we simply interate over all the rounds, and inside each round we do the same per card.
  // In each round we calculate a random score (based on the product of a random score and the user multiplier)
  // We then keep track of the the scores by incrementing the current value on the structure mentioned above.
  rounds.forEach((round, idx) => {
    // console.error(`Processing round #${idx}...`);
    Object.keys(round).forEach((card) => {
      const userScore = roundNumber(getRandomInt(0, 3) * users[round[card]]['multiplier']);
      const user = round[card];
      if (!userScore)
        results['otherStats']['failedCards'][card] = results['otherStats']['failedCards'][card] + 1 || 1 ;
      // console.error(`Player ${user} got ${userScore} points with card ${card}`);
      results['userScores'][user] += userScore;
      results['teamScores'][getTeam(user)] += userScore;
      results['roundScores']['users'][idx][user] += userScore;
      results['roundScores']['teams'][idx][getTeam(user)] += userScore;

    });
  });

  // Merge results with existing config
  return {results, ...{config: {users: users, teams: teams}}};
}

if (typeof window === 'undefined') {
  // Print results to console if this script is invoked via nodejs
  const game = playGame(rounds, users, teams);
  console.log(JSON.stringify(game));
}
