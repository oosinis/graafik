import { weekEnd, sickLeave, vacation, requestOffDay, requestworkDay } from '../const.js';


const shiftLengths = [
  { name: '24-Hour Shift', start: '08:00', end: '8:00', duration: 24 },
  { name:'Day Shift', start: '07:30', end: '19:30', duration: 12 },
];


const shiftMap = shiftLengths.reduce((map, shift) => {
  map[shift.name] = shift;
  return map;
}, {});

const weekdayPersonnel = [

  { count: 1, shift: shiftMap['Day Shift'] },
  { count: 1, shift: shiftMap['24-Hour Shift'] }

];

const weekendPersonnel = [...weekdayPersonnel];

export function processCSVData(csvContent) {

  const weekdays = csvContent[0];

  newTableContent = addShiftRows(csvContent);


  const currentSum = 0;

  const bestSum = -100;

  const listOfBestVersions = [];



  // going through every date
  for (const key in newTableContent[0]) {


    // how many people needed on given date
    if (newTableContent[0][key] in weekEnd) {
      const personnel = weekendPersonnel;
    } 
    else {
      const personnel = weekdayPersonnel;
    }

    // every shift
    for (const shift in personnel) {
    
      // how many people doing that shift
      for (let i = 0; i < shift.count; i++) {

        const savedDataShiftLoop = JSON.parse(JSON.stringify(newTableContent));

        // going through every worker
        // substract two added rows with shifts and completion boolean
        for (let i = 1; i < newTableContent.length - 2; i++) {

          originalValue = csvContent[i][key];

          newValue = savedDataShiftLoop[i][key];

          // check if already scheduled in this version
          if (typeof newValue === 'number') {
            continue;
          }


          // check if empty slot
          // TODO

          // check if sickday
          // TODO

          // check if vacation
          // TODO

          // check if requested off
          // TODO

          // check if requested work
          // TODO

          // date
          console.log(key);
          // worker on given date
          console.log(newTableContent[0][key]);
        }
      }
    }
  }


}

function addShiftRows(csvContent) {

  const newTablecontent = JSON.parse(JSON.stringify(csvContent));


  const shiftTotalWorkers = {};
  const shiftTotalWorkersRow = {};
  const booleanShiftCompletedRow = {};


  for (const shift in shiftMap) {
    if (shiftMap.hasOwnProperty(shift)) {
      shiftTotalWorkers[shift] = 0;
    }
  }
  
  for (const key in newTablecontent[0]) {
    if (isNaN(key)) {
      shiftTotalWorkersRow[key] = 'vahetused';
      booleanShiftCompletedRow[key] = 'paigas';
    } else {
      shiftTotalWorkersRow[key] = shiftTotalWorkers;
      booleanShiftCompletedRow[key] = false;
    }
  }

  newTablecontent.push(shiftTotalWorkersRow);

  newTablecontent.push(booleanShiftCompletedRow);

  return newTablecontent;
}

function getStatusInfo(value) {

  if (value.includes(sickLeave)) return 'Sick Leave';
  if (value.includes(vacation)) return 'Vacation';
  if (value.includes(requestOffDay)) return 'Request Off Day';
  if (value.includes(requestworkDay)) return 'Request Work Day';

  return 'Working';
}