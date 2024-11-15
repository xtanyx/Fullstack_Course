interface values{
  hours: number[];
  target: number;
}

interface ExerciseReport {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const argumentParse = (args: string[]): values => {
  if(args.length < 4) throw new Error('Too few arguments');
  const argc = args.length;
  
  let target: number = 0;
  const hours: number[] = [];

  for (let i: number = 2; i < argc; i++) {
    if(isNaN(Number(args[i]))) {
      throw new Error('All provided values are not numbers');
    }

    if (i === 2) {
      target = Number(args[i]);
      continue;
    }

    hours.push(Number(args[i]));
  }

  return {
    hours: hours,
    target: target
  };
};

export const calculateExercises = (hours_each_day: number[], target: number): ExerciseReport => {
  const average: number = hours_each_day.reduce((sum, hours) => {
    return sum + hours;
  }, 0) / hours_each_day.length;

  const trainingDays: number = hours_each_day.filter(hours => hours !== 0).length;

  let rating: number;
  let ratingDescription: string;

  if (average === target) {
    rating = 3;
    ratingDescription = 'you are doing good';
  }
  else if(average === 0) {
    rating = 1;
    ratingDescription = 'not good';
  }
  else {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength: hours_each_day.length,
    trainingDays: trainingDays,
    success: average === target,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average
  };
};


if(require.main === module) {
  try {
    const {hours, target} = argumentParse(process.argv);
    console.log(calculateExercises(hours, target));
  } catch (error) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
