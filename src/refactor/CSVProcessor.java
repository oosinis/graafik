/*package refactor;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import java.io.FileReader;
import java.io.IOException;

public class CSVProcessor {

    public static void main(String[] args) {
        String filePath = "path_to_your_file.csv";  // Path to the CSV file

        try (CSVReader csvReader = new CSVReader(new FileReader(filePath))) {
            String[] row;

            // Skip headers (first few rows if necessary)
            for (int i = 0; i < 3; i++) {
                csvReader.readNext();
            }

            // Read each row of the CSV
            while ((row = csvReader.readNext()) != null) {
                processRow(row);
            }

        } catch (IOException | CsvValidationException e) {
            e.printStackTrace();
        }
    }

    private static void processRow(String[] row) {
        // Example: printing the "NIMI" and the "TÖÖTAJA NORM" columns
        if (row.length > 0 && row[0] != null && !row[0].trim().isEmpty()) {
            String nimi = row[0].trim(); // "NIMI"
            String tooajaNorm = row.length > 32 ? row[32].trim() : "";  // Column for "TÖÖTAJA NORM"

            System.out.println("Name: " + nimi + ", Norm: " + tooajaNorm);

            // Additional processing can be done here based on your needs
        }
    }
}
*/