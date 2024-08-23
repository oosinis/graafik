package refactor;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

import objects.Shift;
import objects.Worker;

public class MatrixToCSV {
  public static void writeToCSV(Shift[][] scheduleMatrix, String csvFilePath, List<Worker> workers, int[] totalHours) {

    try {
      writeMatrixToCSV(scheduleMatrix, csvFilePath, workers, totalHours);
      System.out.println("Matrix successfully written to " + csvFilePath);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void writeMatrixToCSV(Shift[][] matrix, String filePath, List<Worker> workers, int[] totalHours)
      throws IOException {
    try (PrintWriter writer = new PrintWriter(new FileWriter(filePath, StandardCharsets.UTF_16))) {
      // Write the header row with dates
      writer.print("Employee/Date,");
      for (int day = 1; day <= matrix.length; day++) {
        writer.print("Day " + day + ",");
      }
      writer.print("Töötaja norm,");
      writer.print("Tegelik tööaeg,");
      writer.print("Selle kuu ülejääk,");

      writer.print("Eelmise kuu jääk,");
      writer.print("Puhkuse päevad,");

      writer.println(); // End of header row

      // Write each employee's name and their corresponding shifts
      for (int empIndex = 0; empIndex < workers.size(); empIndex++) {
        Worker employee = workers.get(empIndex);
        StringBuilder rowString = new StringBuilder();
        rowString.append(employee.getNimi()).append(","); // Add the employee name at the start of the row

        for (Shift[] dayShifts : matrix) {
          Shift shift = dayShifts[empIndex];
          rowString.append(shift.getCategory()).append(","); // Add each shift's category
        }

        double tööKoormus = workers.get(empIndex).getTööKoormus();

        int tööKoormuseTunnid;
        int puhkuseTunnid;
        if (tööKoormus == 0.5) {
          tööKoormuseTunnid = 84;
          puhkuseTunnid = 4;
        } else if (tööKoormus == 0.75) {
          tööKoormuseTunnid = 126;
          puhkuseTunnid = 6;
        } else {
          tööKoormuseTunnid = 168;
          puhkuseTunnid = 8;
        }

        int töötajaNorm = (tööKoormuseTunnid - (puhkuseTunnid * workers.get(empIndex).getPuhkusePäevad().size()));
        int töötajaTegelikudTunnid = totalHours[empIndex];
        rowString.append(töötajaNorm + ",");
        rowString.append(töötajaTegelikudTunnid + ",");
        rowString.append(töötajaTegelikudTunnid -töötajaNorm + ",");
        rowString.append(workers.get(empIndex).getEelmiseKuuÜlejääk() + ",");
        rowString.append(workers.get(empIndex).getPuhkusePäevad().size() + ",");

        // Remove trailing comma and write the row
        if (rowString.length() > 0) {
          rowString.setLength(rowString.length() - 1);
        }
        writer.println(rowString.toString());
      }
    }
  }

}
