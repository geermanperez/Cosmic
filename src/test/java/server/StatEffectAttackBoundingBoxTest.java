package server;

import org.junit.jupiter.api.Test;

import java.awt.Point;
import java.awt.Rectangle;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StatEffectAttackBoundingBoxTest {
    @Test
    void usesTheSkillBoundingBoxWhenAvailable() throws ReflectiveOperationException {
        StatEffect effect = new StatEffect();
        setField(effect, "lt", new Point(-400, -350));
        setField(effect, "rb", new Point(400, 250));

        assertEquals(new Rectangle(-300, -150, 800, 600),
                effect.getAttackBoundingBox(new Point(100, 200), true));
        assertEquals(new Rectangle(-300, -150, 800, 600),
                effect.getAttackBoundingBox(new Point(100, 200), false));
    }

    @Test
    void fallsBackToTheForwardSkillRangeWhenBoundsAreAbsent() throws ReflectiveOperationException {
        StatEffect effect = new StatEffect();
        setField(effect, "attackRange", 600);

        assertEquals(new Rectangle(100, -50, 600, 500),
                effect.getAttackBoundingBox(new Point(100, 200), false));
        assertEquals(new Rectangle(-500, -50, 600, 500),
                effect.getAttackBoundingBox(new Point(100, 200), true));
    }

    private static void setField(StatEffect effect, String name, Object value) throws ReflectiveOperationException {
        Field field = StatEffect.class.getDeclaredField(name);
        field.setAccessible(true);
        field.set(effect, value);
    }
}
