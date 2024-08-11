import { weekEnd, sickLeave, vacation, requestOffDay, requestWorkDay, requestsList } from '../const.js';


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


  const emptyTable = csvContent;

  // teeme seti lihtsalt?
  let newTable = [];

  let currentSum = 0;

  let bestTable = []

  let bestSum = -100;

  const listOfBestVersions = [];


  // MAKING LISTS FOR LATER

  let needed_personnel_list = createNeededPersonnelList(csvContent);

  console.log("NEEDED PERSOM ", needed_personnel_list);

  const i = 0;

  let schedule_dates_list = {};
  let schedule_employees_list = {};


  console.log("DATES: ", Object.keys(emptyTable[0]).length)
  console.log("EMPLOYEES: ", emptyTable)

  // iga kuupäev
  dateLoop: for (let date = 0; date < Object.keys(emptyTable[0]).length - 1; date++) {
    //console.log("KUUPÄEV: ", date)

    // iga töötaja
    personnelLoop: for (let needed_personnel_index = 0; needed_personnel_index < needed_personnel_list[date].length; needed_personnel_index++) {

      //console.log("PERSONNEL: ", needed_personnel_list[date][needed_personnel_index]);

      // iga vajalik vahetus sellel kuupäeval
      // - 2 sest lisasin need asjad sinna idk pärast ei tohi unustada
      employeeLoop: for (let employee = 1; employee < emptyTable.length; employee++) {

        console.log("EVERY EMP LOOP: ", newTable)

        let last_scheduled_shift = newTable[newTable.length - 1]


        //console.log("EMPLOYEE: ", employee);

        // check if the employee is already scheduleed at that time
        if (!newTable.some(pair => pair[0] === employee && pair[1] === date)) {

          const schedule_input_info = csvContent[employee][date];

          // the change in this schedule's 'grade'
          let change = 0;
          let next_step = true

          // check the input table info
          switch (schedule_input_info) {

            case 'H':
              //console.log(`Date: ${date}, Employee: ${employee}, Case: H`);
              // haiguslehel jätame vahele, ei saa nvn tööle tulla

              next_step = canWeDoNextStep(newTable, emptyTable, date, employee, last_scheduled_shift, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index, currentSum);
              if (next_step) {
                continue employeeLoop;
              } else {

                // if this is the last step overall:
                if (date === Object.keys(emptyTable[0]).length - 1) {

                  console.log("LÕPP: ", currentSum, bestSum)

                  if (currentSum > bestSum) {          
                    bestSum = currentSum;
                    bestTable = newTable;
                  }
                  
                    next_step = canWeDoNextStep(newTable, emptyTable, date, employee, last_scheduled_shift, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index, currentSum);
                    if (next_step) {
                      continue employeeLoop;
                    } else {
                      continue personnelLoop;
                    }
              
                } else {
                  continue personnelLoop;
                }
              }
            case 'P':
              //console.log(`Date: ${date}, Employee: ${employee}, Case: P`);
              // puhkuse ajal ainult äärmisel juhul
              next_step = canWeDoNextStep(newTable, emptyTable, date, employee, last_scheduled_shift, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index, currentSum);
              if (next_step) {
                continue employeeLoop;
              } else {

                                  // if this is the last step overall:

                          // !!!!!!!!!!!!!!!!!!!
                if (date === Object.keys(emptyTable[0]).length - 1) {

                  console.log("LÕPP: ", currentSum, bestSum)

                  if (currentSum > bestSum) {          
                    bestSum = currentSum;
                    bestTable = newTable;
                  }
                  
                    next_step = canWeDoNextStep(newTable, emptyTable, date, employee, last_scheduled_shift, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index, currentSum);
                    if (next_step) {
                      continue employeeLoop;
                    } else {
                      continue personnelLoop;
                    }
              
                } else {
                  continue personnelLoop;
                }
              }
            case 'X':
              //console.log(`Date: ${date}, Employee: ${employee}, Case: X`);
              // soovipäev ka halb variant, aga parem kui puhkus
              change = -25;
              break;
            case 'T':
              //console.log(`Date: ${date}, Employee: ${employee}, Case: T`);
              // hea panna sellel päeval tööle, aga mitte kui siis keegi peab soovipäeval tööl olema
              change = 10;
              break;

            default:
              //console.log(`Date: ${date}, Employee: ${employee}, Case: Default`);
              // kui on midagi muud, või on tühi, siis summa ei muutu
          }

          // check previous days
          if (date > 0) {

          const employee_previous_shifts = schedule_employees_list[employee];

            // kui praegu on 24h vahetus
            if (needed_personnel_list[date][needed_personnel_index] === shiftMap['24-Hour Shift']) {
              if (csvContent[employee][date + 1] === 'P') {
                change += -10;
              } else if (csvContent[employee][date + 1] === 'X') {
                change += -5;
              }
              // kui töötaja üldse on teinud vahetusi
              if (employee_previous_shifts > 0) {
                // kui kuupäev vähem kui 3 päeva kaugusel ja 24h vahetus
                if (date - employee_previous_shifts[employee_previous_shifts.length - 1][0] < 4) {
                  if (employee_previous_shifts[employee_previous_shifts.length - 1][1] === shiftMap['24-Hour Shift']) {
                  change += -25;
                  } else if (employee_previous_shifts[employee_previous_shifts.length - 1][1] === shiftMap['Day Shift']) {
                    change += -10;
                  }
                }
              }
            }
            // kui on päevane vahetus
            else if (needed_personnel_list[date][needed_personnel_index] == shiftMap['Day Shift']) {

              if (employee_previous_shifts > 0 && date - employee_previous_shifts[employee_previous_shifts.length - 1][0] === 1) {
                if (employee_previous_shifts[employee_previous_shifts.length - 1][1] === shiftMap['24-Hour Shift']) {
                change += -15;
                } 
                else if (employee_previous_shifts[employee_previous_shifts.length - 1][1] === shiftMap['Day Shift']) {

                  if (employee_previous_shifts > 1 && date - employee_previous_shifts[employee_previous_shifts.length - 2][0] === 2) {
                    if (employee_previous_shifts[employee_previous_shifts.length - 2][1] === shiftMap['24-Hour Shift']) {
                      change += -15;
                      } 
                    else if (employee_previous_shifts[employee_previous_shifts.length - 1][1] === shiftMap['Day Shift']) {

                      if (employee_previous_shifts > 2 && date - employee_previous_shifts[employee_previous_shifts.length - 3][0] === 3) {
                        if (employee_previous_shifts[employee_previous_shifts.length - 2][1] === shiftMap['24-Hour Shift']) {
                          change += -15;
                          } 
                        else if (employee_previous_shifts[employee_previous_shifts.length - 1][1] === shiftMap['Day Shift']) {
                          change += -25
                        }
                    }
                  }
                }
                
              }
            }
          }
        }

          // if we take this step, will the result be better thn the previous best one
        if (currentSum + change >= bestSum) {

          let newTableCopy = JSON.parse(JSON.stringify(newTable));

          // Use newTableCopy for modifications
          newTableCopy.push([employee, date, change]);

          // Then, if the path is valid, commit the changes to newTable
          newTable = newTableCopy;

          if (!schedule_dates_list[date]) {
            schedule_dates_list[date] = [[employee, needed_personnel_index, change]];
          } else {
            schedule_dates_list[date].push([employee, needed_personnel_index, change]);
          }
          if (!schedule_employees_list[employee]) {
            schedule_employees_list[employee] = [[date, needed_personnel_list[date][needed_personnel_index]]];
          } else {
            schedule_employees_list[employee].push([date, needed_personnel_list[date][needed_personnel_index]]);
          }
          currentSum += change;

          console.log("PAREM TULEMUS: ", newTable);

          console.log(date)
          console.log(Object.keys(emptyTable[0]).length)

          if (date === Object.keys(emptyTable[0]).length - 1) {

            console.log("LÕPP: ", currentSum, bestSum)

            if (currentSum > bestSum) {          
              bestSum = currentSum;
              bestTable = newTable;
            } else {
            continue personnelLoop;
            }
            
              next_step = canWeDoNextStep(newTable, emptyTable, date, employee, last_scheduled_shift, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index, currentSum);
              if (next_step) {
                continue employeeLoop;
              } else {
                continue personnelLoop;
              }
        
          } 
        }

        // if it is worse and we have no employees left, let's go bck a step
        else if (employee === emptyTable.length - 1) {
          const last_scheduled_shift = emptyTable.pop();
          currentSum -= last_scheduled_shift[2];

          employee = schedule_dates_list[last_scheduled_shift[0]];
          date = last_scheduled_shift[1];
          needed_personnel_index = last_scheduled_shift[1];

          schedule_dates_list[last_scheduled_shift[1]].pop();
          schedule_employees_list[last_scheduled_shift[0]].pop();

          console.log("HALVEM TULEMUS JA TÖÖTAJAD OTSAS: ", newTable);


          continue personnelLoop;
        }

          // if we do have employees left, let's try the next one
        else {
          continue employeeLoop;
        }
      }

        // if employee already scheduled at that time
        else if (employee === emptyTable.length - 1) {
          const last_scheduled_shift = newTable.pop();
          currentSum -= last_scheduled_shift[2];

          employee = schedule_dates_list[last_scheduled_shift[0]];
          date = last_scheduled_shift[1];
          needed_personnel_index = last_scheduled_shift[1];

          schedule_dates_list[last_scheduled_shift[1]].pop();
          schedule_employees_list[last_scheduled_shift[0]].pop();

          console.log("HALVEM TULEMUS JA TÖÖTAJAD OTSAS: ", newTable);


          continue personnelLoop;
        } 
        else {
          continue employeeLoop;
        }



      }
    }


  }

  // date
  //console.log(key);
  // worker on given date
  //console.log(emptyTable[0][key]);




  for (const x in schedule_employees_list) {
    const employee = schedule_employees_list[x]
    for (const el in employee) {
      const date = employee[el][0];

      emptyTable[x][date] = employee[el][1].duration;
    }
  }

  console.log(emptyTable)

  return emptyTable;

}

function createEmptyTable(csvContent) {
  // Get the number of rows and columns from the existing matrix
  const rows = csvContent.length;
  const cols = rows > 0 ? csvContent[0].length : 0;
  
  // Initialize a new matrix with the same dimensions
  const newTable = Array.from({ length: rows }, () => Array(cols).fill(null));

  return newTable;
}

function createNeededPersonnelList(csvContent) {
  const weekdays = Object.values(csvContent[0]).slice(0, -1);
  const needed_personnel_list = [];

  weekdays.forEach((day, date_index) => {
    const personnelSource = weekEnd.includes(day) ? weekendPersonnel : weekdayPersonnel;
    const neededPersonnel = [];

    personnelSource.forEach(personnel => {
      for (let i = 0; i < personnel.count; i++) {
        neededPersonnel.push(personnel.shift);
      }
    });

    needed_personnel_list[date_index] = neededPersonnel;
  });

  return needed_personnel_list;
}


function addShiftRows(csvContent) {

  const emptyTable = JSON.parse(JSON.stringify(csvContent));

  for (const key in emptyTable) {
    console.log(emptyTable[key]);
    for (let i = 1; i < emptyTable.length; i++) {

      if (requestsList.includes(emptyTable[key][i])) {
        emptyTable[key][i] = '';
      }

    }
  }


  const shiftTotalWorkers = {};
  const shiftTotalWorkersRow = {};
  const booleanShiftCompletedRow = {};


  for (const shift in shiftMap) {
    if (shiftMap.hasOwnProperty(shift)) {
      shiftTotalWorkers[shift] = 0;
    }
  }
  
  for (const key in emptyTable[0]) {
    if (isNaN(key)) {
      shiftTotalWorkersRow[key] = 'vahetused';
      booleanShiftCompletedRow[key] = 'paigas';
    } else {
      shiftTotalWorkersRow[key] = shiftTotalWorkers;
      booleanShiftCompletedRow[key] = false;
    }
  }

  emptyTable.push(shiftTotalWorkersRow);

  emptyTable.push(booleanShiftCompletedRow);

  return emptyTable;
}

function canWeDoNextStep(newTable, emptyTable, date, employee, last_scheduled_shift, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index, currentSum) {

  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", employee)

  if (employee === emptyTable.length - 1) {
    removeLastStep(newTable, currentSum, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index)

    return false;
  } 
  else {
    return true;
  }

}

function removeLastStep(newTable, currentSum, schedule_dates_list, schedule_employees_list, needed_personnel_list, needed_personnel_index) {
  const last_scheduled_shift = newTable.pop();
  currentSum -= last_scheduled_shift[2];

  employee = schedule_dates_list[last_scheduled_shift[0]];
  date = last_scheduled_shift[1];
  needed_personnel_index = last_scheduled_shift[1];

  console.log("SIINNN: ", last_scheduled_shift)

  schedule_dates_list[last_scheduled_shift[1]].pop();
  schedule_employees_list[last_scheduled_shift[0]].pop();

  console.log("HALVEM TULEMUS JA TÖÖTAJAD OTSAS: ", newTable);
}

function getStatusInfo(value) {

  if (value.includes(sickLeave)) return 'Sick Leave';
  if (value.includes(vacation)) return 'Vacation';
  if (value.includes(requestOffDay)) return 'Request Off Day';
  if (value.includes(requestworkDay)) return 'Request Work Day';

  return 'Working';
}