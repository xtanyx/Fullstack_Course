import axios from "axios";
import { Diagnosis, Patient, PatientFormValues, Entry, EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getPatient = async (id: string) => {
  const {data} = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  console.log(data);
  return data;
};

const getAllDiagnoses = async () => {
  const {data} = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const createEntry = async(object: EntryWithoutId, id: string) => {
  const {data} = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );
  return data;
};

export default {
  getAll, create, getPatient, getAllDiagnoses, createEntry
};

