import { useParams } from "react-router-dom";
import { Diagnosis, Patient } from "../types";
import patientService from '../services/patients';
import { useEffect, useState } from "react";
import EntryDetails from "./EntryDetails";
import EntryType from "./EntryType";

const PatientView = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [createEntryVisible, setCreateEntryVisible] = useState(false);
  const id = useParams().id;

  useEffect(() => {
    const getPatient = async (id: string) => {
      const patientDetails = await patientService.getPatient(id);
      const allDiagnoses = await patientService.getAllDiagnoses();
      setPatient(patientDetails);
      setDiagnoses(allDiagnoses);
    };
    if (id) {
      getPatient(id);
    }
  }, []);
  
  const entryStyle = {
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    border: '1px solid black'
  };

  if (patient) {
    return (
      <div>
        <h3>{patient.name}</h3>
        <p>
          <li>Gender: {patient.gender}</li>
          <li>ssn: {patient.ssn}</li>
          <li>occupation: {patient.occupation}</li>
        </p>
        {
          createEntryVisible
            ? null
            : <button onClick={() => setCreateEntryVisible(true)}>Create entry</button>
        }
        <EntryType 
          show={createEntryVisible}
          id={patient.id}
          setVisibility={setCreateEntryVisible}
          patient={patient}
          setPatient={setPatient}
          diagnosisCodes={diagnoses.map(d => d.code)}
        />
        <p><strong>entries</strong></p>
        {
          patient.entries.map(entry => 
          <div key={entry.id} style={entryStyle}>
            {entry.date} {entry.description}
            <EntryDetails entry={entry}/>
            {
              entry.diagnosisCodes && entry.diagnosisCodes.length !== 0
                ? <>
                  <strong>Diagnoses:</strong>
                  <ul>
                  {entry.diagnosisCodes?.map(code => {
                    return <li key={code}>{code} {diagnoses.find(diagnosis => diagnosis.code === code)?.name}</li>;
                  })}
                  </ul>
                  </>
                : null
            }
            Diagnosed by {entry.specialist}
          </div>
          )
        }
      </div>
    );
  }  
};

export default PatientView;