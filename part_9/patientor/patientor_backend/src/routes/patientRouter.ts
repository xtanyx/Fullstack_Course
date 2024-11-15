import express, {Response} from 'express';
import { NonSensitivePatient, Patient} from '../types';
import patientService from '../services/patientServices';
import { toNewEntry, toNewPatient } from '../utils';
import {z} from 'zod';
const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res: Response<Patient|null>) => {
  const id = req.params.id;
  res.json(patientService.getPatient(id));
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({error: error.issues});
    }
    else {
      res.status(400).send({error: 'unknown error'});
    }
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const id = req.params.id;
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(newEntry, id);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({error: error.issues});
    }
    else if (error instanceof Error) {
      res.status(400).send({error: error.message});
    }
    else {
      res.status(400).send({error: 'unknown error'});
    }
  }
});

export default router;