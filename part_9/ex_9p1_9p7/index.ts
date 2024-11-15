import express from 'express';
import calculateBmi from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});


app.get('/bmi', (req, res)  => {
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (Object.keys(req.query).length < 2) {
    res.status(400).json({
      error: 'malformatted parameters'
    });
  } else if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({
      error: 'malformatted parameters'
    });
  } else {
    const bmi: string = calculateBmi(height, weight);
    res.json({
      weight: weight,
      height: height,
      bmi: bmi
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {daily_exercises, target}: any = req.body;
  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({error: 'parameters missing'});
  }
  else {
    let isNum: boolean = true;
    for(const num of daily_exercises) {
      if (isNaN(Number(num))){
        isNum = false;
      }
    }
    if (isNum === false || isNaN(Number(target))) {
      res.status(400).json({error: 'malformatted parameters'});
    }
    else {
      res.json(calculateExercises(daily_exercises, target));
    }
  } 
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});