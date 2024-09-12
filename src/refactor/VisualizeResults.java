package refactor;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import objects.Shift;
import objects.Worker;

public class VisualizeResults {

    public static void MatrixToCSV(Shift[][] scheduleMatrix, String csvFilePath, List<Worker> workers) {

        try {
            writeMatrixToCSV(scheduleMatrix, csvFilePath, workers);
            System.out.println("Matrix successfully written to " + csvFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void writeMatrixToCSV(Shift[][] matrix, String filePath, List<Worker> workers)
            throws IOException {

        int[] totalHours = getTotalHours(matrix, workers);
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath, StandardCharsets.UTF_16))) {
            // Write the header row with dates
            writer.print("Employee/Date,");
            writer.print(",");
            for (int day = 1; day <= matrix.length; day++) {
                writer.print("Day " + day + ",");
            }
            writer.print("Töötaja norm,");
            writer.print("Tegelik tööaeg,");
            writer.print("Selle kuu ülejääk,");

            writer.print("Eelmise kuu jääk,");
            writer.print("Puhkuse päevad,");
            writer.print("Kvartali ülejääk,");


            writer.println(); // End of header row

            // Write each employee's name and their corresponding shifts
            for (int empIndex = 0; empIndex < workers.size(); empIndex++) {
                Worker employee = workers.get(empIndex);
                List<Shift> vahetused = new ArrayList<>(Arrays.asList(new Shift(24, Shift.INTENSIIV),
                        new Shift(24, Shift.OSAKOND), new Shift(8, Shift.LÜHIKE_PÄEV)));

                for (int shiftIndex = 0; shiftIndex < vahetused.size(); shiftIndex++) {

                    StringBuilder rowString = new StringBuilder();
                    rowString.append(employee.getName()).append(",");

                    rowString.append(vahetused.get(shiftIndex).getCategory()).append(",");

                    for (Shift[] dayShifts : matrix) {
                        Shift shift = dayShifts[empIndex];
                        if (shift.getCategory().equals(vahetused.get(shiftIndex).getCategory()))
                            rowString.append(shift.getDuration()).append(",");
                        else if (vahetused.get(shiftIndex).getCategory() == Shift.LÜHIKE_PÄEV && shift.getCategory().equals("P"))
                            rowString.append("P,");
                        else if (vahetused.get(shiftIndex).getCategory() == Shift.LÜHIKE_PÄEV && shift.getCategory().equals("D"))
                            rowString.append("D,");
                        else
                            rowString.append(",");

                    }


                    int töötajaNorm = (workers.get(empIndex).getWorkLoadHours());
                    int töötajaTegelikudTunnid = totalHours[empIndex];
                    rowString.append(töötajaNorm + ",");
                    rowString.append(töötajaTegelikudTunnid + ",");
                    rowString.append(töötajaTegelikudTunnid - töötajaNorm + ",");
                    rowString.append(workers.get(empIndex).getLastMonthLastDayHours() + ",");
                    rowString.append(workers.get(empIndex).getVacationDays().size() + ",");
                    rowString.append(workers.get(empIndex).getQuarterHoursBalance() + ",");

                    // Remove trailing comma and write the row
                    if (rowString.length() > 0) {
                        rowString.setLength(rowString.length() - 1);
                    }
                    writer.println(rowString.toString());


                }
            }
        }
    }

    public static void printSchedule(Shift[][] scheduleMatrix, List<Worker> workers) {

        int[] totalHours = getTotalHours(scheduleMatrix, workers);


        for (int day = 0; day < scheduleMatrix.length; day++) {
            //System.out.print("Day " + (day + 1) + ": ");
            for (int emp = 0; emp < scheduleMatrix[day].length; emp++) {
                Shift shift = scheduleMatrix[day][emp];
                System.out.print(workers.get(emp).getName() + ": " + shift.getCategory() + "| ");
            }
            System.out.println();
        }

        System.out.println("\nTotal hours worked by each employee:");
        for (int emp = 0; emp < totalHours.length; emp++) {
            System.out.println(workers.get(emp).getName() + ": " + totalHours[emp] + " hours");
        }
    }

    private static int[] getTotalHours(Shift[][] scheduleMatrix, List<Worker> workers) {
        int[] totalHours = new int[workers.size()];

        for (int day = 0; day < scheduleMatrix.length; day++) {
            for (int worker = 0; worker < scheduleMatrix[day].length; worker++) {
                Shift shift = scheduleMatrix[day][worker];
                totalHours[worker] += shift.getDuration();
            }
        }
        for (Worker worker : workers) {
            totalHours[worker.getEmployeeId()] += worker.getLastMonthLastDayHours();
        }

        return totalHours;
    }
}
