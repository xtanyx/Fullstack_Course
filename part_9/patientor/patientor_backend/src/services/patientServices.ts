import {Patient, NonSensitivePatient, NewPatientEntry, EntryWithoutId, Entry} from "../types";
import patientData from '../../data/patients';
import {v1 as uuid} from 'uuid';

const getAll = (): Patient[] => {
  return patientData;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientData.map(({id, name, dateOfBirth, gender, occupation}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | null => {
  const patient = patientData.find(patient => patient.id === id);
  const entryTypes = ['Hospital', 'OccupationalHealthcare', 'HealthCheck'];
  if (!patient) {
    return null;
  }

  for (const entry of patient.entries) {
    if (!(entryTypes.includes(entry.type))) {
      patient.entries = patient.entries.filter(e => e.id !== entry.id);
    }
  }

  return patient;
};

const addPatient = (object: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...object
  };

  patientData.push(newPatient);

  return newPatient;
};

const addEntry = (object: EntryWithoutId, id: string) => {
  const newEntry: Entry = {
    id: uuid(),
    ...object
  };
  const index = patientData.findIndex(patient => patient.id === id);
  patientData[index].entries.push(newEntry);

  return newEntry;
};

export default {getAll, getNonSensitivePatients, getPatient, addPatient, addEntry};