import { weekEnd, sickLeave, vacation, requestOffDay, requestWorkDay, requestsList } from '../const.js';

// Define shift lengths with duration
const shiftLengths = [
  { name: 'Day Shift', start: '07:30', end: '19:30', duration: 12 },
  { name: '24-Hour Shift', start: '08:00', end: '08:00', duration: 24 },
];

// Create a map for quick lookup of shift durations by name
const shiftMap = shiftLengths.reduce((map, shift) => {
  map[shift.name] = shift;
  return map;
}, {});

// Personnel required for weekdays and weekends
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
        // Assign the shift duration to the cell
        emptyTable[employeeId][parseInt(date) + 1] = shiftMap[neededPersonnelList[date][shiftIdx].name].duration; // +1 to account for the title column
      }
    }
  }

  // Calculate total hours worked for each employee
  const totalHoursWorked = calculateTotalHoursWorked(bestState.schedule);

  // Ensure each row is an array and append total hours worked
  emptyTable.forEach((row, idx) => {
    if (idx > 0) { // Skip the header row
      emptyTable[idx]['Kokku'] = totalHoursWorked[idx] || 0
    }
  });

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
  if (dateIdx === numberOfDates) {
    console.table(state.schedule)
    const totalHours = calculateTotalHoursWorked(state.schedule);
    const medianDifferenceTotalHours = calculateMedianDifference(totalHours);
    state.currentSum -= (2 * medianDifferenceTotalHours);

    if (state.currentSum > bestState.currentSum) {
      bestState.schedule = JSON.parse(JSON.stringify(state.schedule));
      bestState.currentSum = state.currentSum;
    }
    return;
  }

  const shiftsForDate = neededPersonnelList[dateIdx];
  const totalShifts = shiftsForDate.length;

  if (shiftIdx === totalShifts) {
    backtrack(dateIdx + 1, 0, state, neededPersonnelList, emptyTable, numberOfDates, bestState);
    return;
  }

  for (let employeeId = 1; employeeId < emptyTable.length; employeeId++) {
    if (isEmployeeScheduled(state.schedule, dateIdx, employeeId)) {
      continue;
    }

    const availability = emptyTable[employeeId][dateIdx + 1];
    if (!isEmployeeAvailable(availability, shiftsForDate[shiftIdx])) {
      continue;
    }

    if (!checkOtherConstraints(state.employeeShifts, employeeId, dateIdx, shiftsForDate[shiftIdx], emptyTable)) {
      continue;
    }

    const changeInSum = calculateChangeInSum(availability, state.employeeShifts, employeeId, dateIdx, shiftsForDate[shiftIdx]);
    
    // Pruning based on current state vs best state
    if (state.currentSum + changeInSum <= bestState.currentSum) {
      continue;
    }

    assignShift(state, dateIdx, shiftIdx, employeeId, changeInSum);

    backtrack(dateIdx, shiftIdx + 1, state, neededPersonnelList, emptyTable, numberOfDates, bestState);

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
  if (availability === 'H') return false; // On sick leave
  if (availability === 'P') return false; // On vacation
  return true; // Available
}

function checkOtherConstraints(employeeShifts, employeeId, dateIdx, shift, emptyTable) {
  const previousShifts = employeeShifts[employeeId];

  if (shift === shiftMap['24-Hour Shift']) {
    const nextDayAvailability = emptyTable[employeeId][dateIdx + 2];
    if (!isAvailableNextDay(nextDayAvailability)) {
      return false;
    }
  }

  if (!previousShifts) return true; // No previous shifts

  // If the current shift is a "Day Shift"
  if (shift === shiftMap['Day Shift']) {
      const consecutiveDayShifts = countConsecutiveDayShifts(previousShifts, dateIdx);

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

function isAvailableNextDay(availability) {
  return isEmployeeAvailable(availability);
}

function requiredRestDays(shift) {
  // Return the required number of rest days after a given shift
  if (shift === shiftMap['24-Hour Shift']) return 4;

  // For "Day Shift", we manage it in checkOtherConstraints
  return 0;
}

function calculateChangeInSum(availability, employeeShifts, employeeId, dateIdx, shift) {
  // Implement logic to calculate the change in the cumulative score
  let change = 0;
  if (availability === 'X') change = 25; // Undesirable day
  if (availability === 'T') change = 10; // Preferred day

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

function calculateTotalHoursWorked(schedule) {
  const totalHours = {};

  for (const date in schedule) {
    for (const shiftIdx in schedule[date]) {
      const employeeId = schedule[date][shiftIdx];
      
      if (!totalHours[employeeId]) {
        totalHours[employeeId] = 0;
      }

      // Get the shift name using shiftIdx
      const shiftName = Object.keys(shiftMap)[shiftIdx]; // Get shift name by index
      const shift = shiftMap[shiftName];
      const shiftDuration = shift ? shift.duration : 0;

      // Add the shift duration to the total hours
      totalHours[employeeId] += shiftDuration;
    }
  }

  return totalHours;
}

function calculateMedianDifference(values) {
  // Extract the values from the object
  const valueArray = Object.values(values);
  
  // Calculate all pairwise differences
  const differences = [];
  for (let i = 0; i < valueArray.length; i++) {
    for (let j = i + 1; j < valueArray.length; j++) {
      differences.push(Math.abs(valueArray[i] - valueArray[j]));
    }
  }

  // Sort the differences in ascending order
  differences.sort((a, b) => a - b);

  // Find the median
  const mid = Math.floor(differences.length / 2);
  if (differences.length % 2 === 0) {
    // If even number of differences, return the average of the two middle values
    return (differences[mid - 1] + differences[mid]) / 2;
  } else {
    // If odd number of differences, return the middle value
    return differences[mid];
  }
}

function getStatusInfo(value) {
  if (value.includes(sickLeave)) return 'Sick Leave';
  if (value.includes(vacation)) return 'Vacation';
  if (value.includes(requestOffDay)) return 'Request Off Day';
  if (value.includes(requestWorkDay)) return 'Request Work Day';

  return 'Working';
}
