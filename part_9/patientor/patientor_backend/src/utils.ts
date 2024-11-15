import { NewPatientEntry, Gender, EntryWithoutId, Diagnosis, EntryType, HealthCheckRating } from "./types";
import { z } from "zod";

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseName = (name: unknown): string => {
//   if (!isString(name)) {
//     throw new Error('Incorrect name');
//   }

//   return name;
// };

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };

// const parseDOB = (dob: unknown): string => {
//   if(!isString(dob) || !isDate(dob)) {
//     throw new Error('Incorrect dateOfBirth: ' + dob);
//   }
//   return dob;
// };

// const parseSSN = (ssn: unknown): string => {
//   if(!isString(ssn)) {
//     throw new Error('Incorrect ssn');
//   }

//   return ssn;
// };

// const parseOccupation = (occupation: unknown): string => {
//   if(!isString(occupation)) {
//     throw new Error('Incorrect occupation');
//   }

//   return occupation;
// };

// const isGender = (gender: string): gender is Gender => {
//   return Object.values(Gender).map(g => g.toString()).includes(gender);
// };

// const parseGender = (gender: unknown): Gender => {
//   if (!isString(gender) || !isGender(gender)) {
//     throw new Error('Incorrect gender: ' + gender);
//   }

//   return gender;
// };

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  ssn: z.string()
});

const newEntrySchema = z.object({
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
});


export const toNewPatient = (object: unknown): NewPatientEntry => {
  return {...newPatientSchema.parse(object), entries: []};
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  const newEntry = newEntrySchema.parse(object);
  const diagnosisCodes = parseDiagnosisCodes(object);
  if (object && 
    typeof object === 'object' && 
    'type' in object && 
    typeof object.type === 'string' && 
    Object.values(EntryType).map(v => v.toString()).includes(object.type)) {
    switch(object.type) {
      case 'HealthCheck': {
        if ('healthCheckRating' in object) {
          return {...newEntry, type: 'HealthCheck', healthCheckRating: z.nativeEnum(HealthCheckRating).parse(object.healthCheckRating), diagnosisCodes: diagnosisCodes};
        } else {
          throw new Error('HealthCheckRating missing');
        }
      }
      case 'OccupationalHealthcare': {
        if ('employerName' in object) {
          if ('sickLeave' in object && 
            object.sickLeave && 
            typeof object.sickLeave === 'object' &&
            'startDate' in object.sickLeave &&
            'endDate' in object.sickLeave
          ) {
            return {...newEntry,
              type: 'OccupationalHealthcare',
              employerName: z.string().parse(object.employerName),
              sickLeave: {startDate: z.string().date().parse(object.sickLeave.startDate), endDate: z.string().date().parse(object.sickLeave.endDate)},
              diagnosisCodes: diagnosisCodes
            };
          }
          return {...newEntry, type: 'OccupationalHealthcare', employerName: z.string().parse(object.employerName), diagnosisCodes: diagnosisCodes};
        } else {
          throw new Error('Employer Name missing');
        }
      }
      case 'Hospital': {
        if ('discharge' in object && 
          object.discharge && 
          typeof object.discharge === 'object' && 
          'criteria' in object.discharge &&
          'date' in object.discharge) {
          return {...newEntry, 
            type: 'Hospital', 
            discharge: {date: z.string().date().parse(object.discharge.date), criteria: z.string().parse(object.discharge.criteria)}, diagnosisCodes: diagnosisCodes};
        } else {
          throw new Error('Discharge information missing');
        }
      }
      default: {
        throw new Error('Wrong type');
      }
    }
  }
  else {
    throw new Error('Wrong or missing data');
  }
};