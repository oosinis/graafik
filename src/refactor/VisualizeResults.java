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
                List<String> shiftCategories = new ArrayList<>(Arrays.asList(Shift.INTENSIIV, Shift.OSAKOND));

                for (String category : shiftCategories) {

                    StringBuilder rowString = new StringBuilder();
                    rowString.append(employee.getName()).append(",");

                    rowString.append(category).append(",");

                    for (Shift[] dayShifts : matrix) {
                        Shift shift = dayShifts[empIndex];

                        if (category.equals(Shift.INTENSIIV)) {
                            switch (shift.getCategory()) {
                                case Shift.INTENSIIV -> rowString.append(shift.getDuration()).append(",");
                                case Shift.PUHKUS -> rowString.append("P,");
                                case Shift.SOOVI_PUHKUS -> rowString.append("D,");
                                case Shift.KOOLITUS -> rowString.append("K,");
                                default -> rowString.append(",");
                            }
                        }
                        else if (category.equals(Shift.OSAKOND)) {
                            switch (shift.getCategory()) {
                                case Shift.OSAKOND -> rowString.append(shift.getDuration()).append(",");
                                case Shift.KOOLITUS -> rowString.append(8 + ",");
                                default -> rowString.append(",");
                            }
                        }
                    }
                    


                    int töötajaNorm = (workers.get(empIndex).getWorkLoadHours() + (workers.get(empIndex).getTrainingDays().size() * 8));
                    int töötajaTegelikudTunnid = totalHours[empIndex];
                    rowString.append(töötajaNorm + ",");
                    rowString.append(töötajaTegelikudTunnid + ",");
                    rowString.append(töötajaTegelikudTunnid - töötajaNorm + ",");
                    rowString.append(workers.get(empIndex).getLastMonthBalance() + ",");
                    rowString.append(workers.get(empIndex).getVacationDays().size() + ",");
                    rowString.append(töötajaTegelikudTunnid - töötajaNorm + workers.get(empIndex).getLastMonthBalance() + ",");

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

        return totalHours;
    }
}
