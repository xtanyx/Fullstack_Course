interface Values{
  height: number;
  weight: number;
}

const argumentParser = (args: string[]): Values => {
  if (args.length > 4) throw new Error('Too many arguments');
  if (args.length < 4) throw new Error('Not enough arguments');
  
  const height: number = Number(args[2]);
  const weight: number = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('All provided values are not numbers');
  }

  if (height === 0) {
    throw new Error('Division by zero! Height cannot be 0.');
  }

  return {
    height: height,
    weight: weight
  };
};

const calculateBmi = (height: number, weight: number): string => {
  const ratio: number = weight/((height/100)*(height/100));

  if(ratio < 18.5){
    return 'Underweight';
  }
  else if(ratio <= 24.9){
    return 'Normal range';
  }
  else if(ratio <= 29.9){
    return 'Overweight';
  }
  else{
    return 'Obese';
  }
};

if (require.main === module) {
  try{
    const {height, weight} = argumentParser(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateBmi;