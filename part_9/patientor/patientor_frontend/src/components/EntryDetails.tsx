import { Entry } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({entry}: {entry: Entry}) => {
  const detailStyle = {
    paddingTop: 5,
    paddingBottom: 5
  };

  switch(entry.type) {
    case 'HealthCheck': {
      return (
        <div style={detailStyle}>
          Heath Rating: {entry.healthCheckRating}
        </div>
      );
    }
    case 'Hospital': {
      return (
        <div style={detailStyle}>
          <strong>Discharge</strong>
          <div>
            Date: {entry.discharge.date}<br></br>
            Criteria: {entry.discharge.criteria}
          </div>
        </div>
      );
    }
    case 'OccupationalHealthcare': {
      return (
        <div style={detailStyle}>
          Employer: {entry.employerName}<br/>
          {entry.sickLeave ? <span>Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</span> : null}
        </div>
      );
    }
    default: {
      return assertNever(entry);
    }
  }
};

export default EntryDetails;