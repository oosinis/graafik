package com.backend.graafik.model;

public class Shift {
    // Attributes
    private int duration; // Duration in minutes or hours
    private String category;


    // Categories
    public static final String INTENSIIV = "intensiiv";
    public static final String LÜHIKE_PÄEV = "lühike päev";
    public static final String OSAKOND = "osakond";
    public static final String TÜHI = "";
    public static final String PUHKUS = "P";
    public static final String SOOVI_PUHKUS = "D";
    public static final String KEELATUD = "X";
    public static final String KOOLITUS = "K";

    // Constructor
    public Shift(int duration, String category) {
        this.duration = duration;
        setCategory(category);
    }

    // Getter for duration
    public int getDuration() {
        return duration;
    }

    // Setter for duration
    public void setDuration(int duration) {
        this.duration = duration;
    }

    // Getter for category
    public String getCategory() {
        return category;
    }

    // Setter for category with validation
    public void setCategory(String category) {
        if (category.equals(INTENSIIV) || category.equals(LÜHIKE_PÄEV) || category.equals(OSAKOND)
                || category.equals(TÜHI) || category.equals(PUHKUS) || category.equals(SOOVI_PUHKUS) || category.equals(KEELATUD) || category.equals(KOOLITUS)) {
            this.category = category;
        } else {
            throw new IllegalArgumentException("Invalid category. Choose from: intensiiv, lühike, osakond, tühi, puhkus, soovi_puhkus, keelatud, koolitus");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Shift shift = (Shift) o;
        return this.getDuration() == shift.getDuration() && this.getCategory().equals(shift.getCategory());
    }

    @Override
    public String toString() {
        return "Vahetus{" +
                "pikkus=" + duration +
                ", kategooria='" + category + '\'' +
                '}';
    }
}
