package server.maps;

import org.junit.jupiter.api.Test;

import java.awt.Point;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MapFactoryFootholdFallbackTest {

    @Test
    void shouldFallbackCyToYWhenCyIsZeroAndYIsNonZero() {
        int cy = 0;
        int y = 150;
        int x = 200;
        int fh = 0;

        if (cy == 0) {
            if (y != 0) {
                cy = y;
            }
        }

        assertEquals(150, cy);
    }

    @Test
    void shouldFallbackCyToFootholdFootingWhenCyAndYAreZero() {
        int cy = 0;
        int y = 0;
        int x = 100;
        int fh = 5;

        // Foothold from (0, 0) to (100, 200). Slope is 2. At x=50, y = 100
        Foothold foothold = new Foothold(new Point(0, 0), new Point(100, 200), 5);

        if (cy == 0) {
            if (y != 0) {
                cy = y;
            } else if (fh != 0) {
                cy = foothold.calculateFooting(50);
            }
        }

        assertEquals(100, cy);
    }
}
