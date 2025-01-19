package com.graafik.model;

public class Shift {
    // Attributes
    private int duration; // Duration in minutes or hours
    private String type;


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
    public Shift(int duration, String type) {
        this.duration = duration;
        setType(type);
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
    public String getType() {
        return type;
    }

    // Setter for category with validation
    public void setType(String type) {
        if (type.equals(INTENSIIV) || type.equals(LÜHIKE_PÄEV) || type.equals(OSAKOND)
                || type.equals(TÜHI) || type.equals(PUHKUS) || type.equals(SOOVI_PUHKUS) || type.equals(KEELATUD) || type.equals(KOOLITUS)) {
            this.type = type;
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
        return this.getDuration() == shift.getDuration() && this.getType().equals(shift.getType());
    }

    @Override
    public String toString() {
        return "Vahetus{" +
                "pikkus=" + duration +
                ", kategooria='" + type + '\'' +
                '}';
    }
}
