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
  // Deep copy to avoid mutation
  const emptyTable = JSON.parse(JSON.stringify(csvContent)); 
  const neededPersonnelList = createNeededPersonnelList(emptyTable);
  // Exclude the name/title column
  const numberOfDates = Object.keys(emptyTable[0]).length - 1; 

  const initialState = {
    schedule: {}, // { date: { shiftIndex: employeeId } }
    employeeShifts: {}, // { employeeId: [dates they are scheduled] }
    currentSum: 0,
  };

  let bestState = {
    schedule: null,
    currentSum: -Infinity,
  };

  // Start recursive backtracking
  backtrack(
    0, // current date index
    0, // current shift index
    initialState,
    neededPersonnelList,
    emptyTable,
    numberOfDates,
    bestState
  );

  // After backtracking, apply the best schedule to the emptyTable
  if (bestState.schedule) {
    for (const date in bestState.schedule) {
      for (const shiftIdx in bestState.schedule[date]) {
        const employeeId = bestState.schedule[date][shiftIdx];
        // Assign the shift duration or identifier to the cell
        emptyTable[employeeId][parseInt(date) + 1] = neededPersonnelList[date][shiftIdx].duration; // +1 to account for the title column
      }
    }
  }

  return emptyTable;
}

// Recursive backtracking function
function backtrack(
  dateIdx,
  shiftIdx,
  state,
  neededPersonnelList,
  emptyTable,
  numberOfDates,
  bestState
) {
  // If all dates are processed
  if (dateIdx === numberOfDates) {
    // Check if current schedule is better than the best found so far
    if (state.currentSum > bestState.currentSum) {
      bestState.schedule = JSON.parse(JSON.stringify(state.schedule));
      bestState.currentSum = state.currentSum;
    }
    return;
  }


  const shiftsForDate = neededPersonnelList[dateIdx];
  const totalShifts = shiftsForDate.length;

  // If all shifts for the current date are processed, move to the next date
  if (shiftIdx === totalShifts) {
    backtrack(dateIdx + 1, 0, state, neededPersonnelList, emptyTable, numberOfDates, bestState);
    return;
  }

  // Try assigning each employee to the current shift
  for (let employeeId = 1; employeeId < emptyTable.length; employeeId++) {
    // Check if employee is already scheduled for this date
    if (isEmployeeScheduled(state.schedule, dateIdx, employeeId)) {
      continue;
    }

    // Check if employee is available for this shift
    const availability = emptyTable[employeeId][dateIdx + 1]; // +1 to account for the title column
    if (!isEmployeeAvailable(availability, shiftsForDate[shiftIdx])) {
      continue;
    }

    // Check other constraints (e.g., rest periods)
    if (!checkOtherConstraints(state.employeeShifts, employeeId, dateIdx, shiftsForDate[shiftIdx])) {
      continue;
    }

    // Calculate the change in score
    const changeInSum = calculateChangeInSum(availability, state.employeeShifts, employeeId, dateIdx, shiftsForDate[shiftIdx]);

    // Prune if the potential sum isn't better than the best found so far
    if (state.currentSum + changeInSum <= bestState.currentSum) {
      continue;
    }

    // Make the assignment
    assignShift(state, dateIdx, shiftIdx, employeeId, changeInSum);

    // Recursive call to assign the next shift
    backtrack(
      dateIdx,
      shiftIdx + 1,
      state,
      neededPersonnelList,
      emptyTable,
      numberOfDates,
      bestState
    );

    // Backtrack: undo the assignment
    unassignShift(state, dateIdx, shiftIdx, employeeId, changeInSum);
  }
}

// Helper functions

function isEmployeeScheduled(schedule, dateIdx, employeeId) {
  if (!schedule[dateIdx]) return false;
  for (const shift in schedule[dateIdx]) {
    if (schedule[dateIdx][shift] === employeeId) {
      return true;
    }
  }
  return false;
}

function isEmployeeAvailable(availability, shift) {
  // Implement logic based on the 'H', 'P', 'X', 'T', or other codes
  // For example:
  if (availability === 'H') return false; // On sick leave
  if (availability === 'P') return false; // On vacation
  // Add more conditions as needed
  return true; // Available
}
function checkOtherConstraints(employeeShifts, employeeId, dateIdx, shift) {
  const previousShifts = employeeShifts[employeeId];
  if (!previousShifts) return true; // No previous shifts

  // If the current shift is a "Day Shift"
  if (shift === shiftMap['Day Shift']) {
      const consecutiveDayShifts = countConsecutiveDayShifts(previousShifts, dateIdx);

      console.log(consecutiveDayShifts)

      if (consecutiveDayShifts >= 3) {
          // This would be the third day of "Day Shift"
          // Check if the employee has had at least 3 days of rest after the last "Day Shift"
          const lastShiftDate = previousShifts[previousShifts.length - 1];
          const daysSinceLastShift = dateIdx - lastShiftDate;

          if (daysSinceLastShift < 3) {
              return false; // Not enough rest after 3 consecutive "Day Shifts"
          }
      } else if (consecutiveDayShifts === 0 && isComingFromDayShift(employeeShifts[employeeId], dateIdx)) {
          return false; // Starting a new sequence of "Day Shifts" without enough rest
      }
  }

  // For other shifts, or if the day shift rule doesn't apply, check the normal rest days
  for (const prevDateIdx of previousShifts) {
      const daysBetween = dateIdx - prevDateIdx;
      if (daysBetween < requiredRestDays(shift)) {
          return false;
      }
  }

  return true;
}

function countConsecutiveDayShifts(previousShifts, dateIdx) {
  let count = 0;
  let idx = previousShifts.length - 1;

  // Count consecutive "Day Shifts" up to the current date
  while (idx >= 0 && dateIdx - previousShifts[idx] === 1) {
      count++;
      dateIdx = previousShifts[idx];
      idx--;
  }

  return count;
}

function isComingFromDayShift(previousShifts, dateIdx) {
  const lastShiftDate = previousShifts[previousShifts.length - 1];
  const daysSinceLastShift = dateIdx - lastShiftDate;

  // Returns true if the last shift was a "Day Shift" and it was 1 day before the current shift
  return daysSinceLastShift <= 3;
}

function requiredRestDays(shift) {
  // Return the required number of rest days after a given shift
  if (shift === shiftMap['24-Hour Shift']) return 4;

  // For "Day Shift", we manage it in checkOtherConstraints
  return 0;
}


function calculateChangeInSum(availability, employeeShifts, employeeId, dateIdx, shift) {
  // Implement logic to calculate the change in the cumulative score
  // For example:
  let change = 0;
  if (availability === 'X') change -= 25; // Undesirable day
  if (availability === 'T') change += 10; // Preferred day

  // Add more based on previous shifts, etc.
  return change;
}

function assignShift(state, dateIdx, shiftIdx, employeeId, changeInSum) {
  // Update the schedule
  if (!state.schedule[dateIdx]) {
    state.schedule[dateIdx] = {};
  }
  state.schedule[dateIdx][shiftIdx] = employeeId;

  // Update employee shifts
  if (!state.employeeShifts[employeeId]) {
    state.employeeShifts[employeeId] = [];
  }
  state.employeeShifts[employeeId].push(dateIdx);

  // Update the cumulative sum
  state.currentSum += changeInSum;
}

function unassignShift(state, dateIdx, shiftIdx, employeeId, changeInSum) {
  // Remove from the schedule
  delete state.schedule[dateIdx][shiftIdx];
  if (Object.keys(state.schedule[dateIdx]).length === 0) {
    delete state.schedule[dateIdx];
  }

  // Remove from employee shifts
  const index = state.employeeShifts[employeeId].indexOf(dateIdx);
  if (index > -1) {
    state.employeeShifts[employeeId].splice(index, 1);
  }
  if (state.employeeShifts[employeeId].length === 0) {
    delete state.employeeShifts[employeeId];
  }

  // Update the cumulative sum
  state.currentSum -= changeInSum;
}

function createNeededPersonnelList(csvContent) {
  const weekdays = Object.values(csvContent[0]).slice(1); // Exclude the title column
  const neededPersonnelList = [];

  weekdays.forEach((day, dateIndex) => {
    const personnelSource = weekEnd.includes(day) ? weekendPersonnel : weekdayPersonnel;
    const neededPersonnel = [];

    personnelSource.forEach(personnel => {
      for (let i = 0; i < personnel.count; i++) {
        neededPersonnel.push(personnel.shift);
      }
    });

    neededPersonnelList[dateIndex] = neededPersonnel;
  });

  return neededPersonnelList;
}


function getStatusInfo(value) {

  if (value.includes(sickLeave)) return 'Sick Leave';
  if (value.includes(vacation)) return 'Vacation';
  if (value.includes(requestOffDay)) return 'Request Off Day';
  if (value.includes(requestworkDay)) return 'Request Work Day';

  return 'Working';
}