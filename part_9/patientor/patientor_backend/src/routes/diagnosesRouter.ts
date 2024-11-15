import express, {Response} from 'express';
import diagnosesService from '../services/diagnosesService';
import { Diagnosis } from '../types';
const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnosesService.getAll());
});

export default router;