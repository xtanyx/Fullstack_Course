import { useState } from "react";
import { Diagnosis, Patient } from "../types";
import HealthCheckEntry from "./HealthCheckEntry";
import HospitalEntry from "./HospitalEntry";
import OccupationalEntry from "./OccupationalEntry";

interface Props{
  show: boolean;
  id: string;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>
  diagnosisCodes: Array<Diagnosis['code']>
}

const EntryType = (props: Props) => {
  const [entryType, setEntryType] = useState('');

  if(!props.show){
    return null;
  }

  return(
    <div>
      <h2>Select Type</h2>
      {
        entryType === ''
          ? <div>
            <button onClick={() => setEntryType('healthCheck')}>Health Check</button>
            <button onClick={() => setEntryType('hospital')}>Hospital</button>
            <button onClick={() => setEntryType('occupational')}>Occupational</button>
            <p>
              <button onClick={() => props.setVisibility(false)}>cancel</button>
            </p>
          </div>
          : <div>
            <HealthCheckEntry type={entryType} id={props.id} setEntryType={setEntryType} patient={props.patient} setPatient={props.setPatient} diagnosisCodes={props.diagnosisCodes}/>
            <HospitalEntry type={entryType} id={props.id} setEntryType={setEntryType} patient={props.patient} setPatient={props.setPatient} diagnosisCodes={props.diagnosisCodes}/>
            <OccupationalEntry type={entryType} id={props.id} setEntryType={setEntryType} patient={props.patient} setPatient={props.setPatient} diagnosisCodes={props.diagnosisCodes}/>
          </div>
      }
    </div>
  );
};

export default EntryType;