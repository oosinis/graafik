package objects;

public class Shift {
    // Attributes
    private int pikkus; // Duration in minutes or hours
    private String kategooria;

    // Categories
    public static final String INTENSIIV = "intensiiv";
    public static final String LÜHIKE_PÄEV = "lühike päev";
    public static final String OSAKOND = "osakond";

    // Constructor
    public Shift(int pikkus, String kategooria) {
        this.pikkus = pikkus;
        setCategory(kategooria);
    }

    // Getter for duration
    public int getDuration() {
        return pikkus;
    }

    // Setter for duration
    public void setDuration(int duration) {
        this.pikkus = duration;
    }

    // Getter for category
    public String getCategory() {
        return kategooria;
    }

    // Setter for category with validation
    public void setCategory(String category) {
        if (category.equals(INTENSIIV) || category.equals(LÜHIKE_PÄEV) || category.equals(OSAKOND)) {
            this.kategooria = category;
        } else {
            throw new IllegalArgumentException("Invalid category. Choose from: intensiiv, lühike, osakond.");
        }
    }

    @Override
    public String toString() {
        return "Vahetus{" +
                "pikkus=" + pikkus +
                ", kategooria='" + kategooria + '\'' +
                '}';
    }
}