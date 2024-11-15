import { Diagnosis } from "../types";
import diagnosesData from '../../data/diagnoses';

const getAll = ():Diagnosis[] => {
  return diagnosesData;
};

export default {getAll};