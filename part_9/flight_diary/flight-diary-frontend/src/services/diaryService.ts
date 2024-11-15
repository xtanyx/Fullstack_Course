import axios from 'axios';
import { NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3001/api/diaries';

export const getAll = () => {
  console.log('getting...');
  return axios
    .get<NonSensitiveDiaryEntry>(baseUrl)
    .then(response => response.data)
};

export const addEntry = (entry: NewDiaryEntry) => {
  console.log('adding...');
  return axios
    .post(baseUrl, entry)
    .then(response => response.data)
};