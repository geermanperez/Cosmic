package net.server.channel.handlers;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AttackDamageTest {
    @Test
    void criticalDisplayFlagPreservesExactDamage() {
        assertEquals(1500, AttackDamage.magnitude(1500 | Integer.MIN_VALUE));
        assertEquals(0, AttackDamage.magnitude(Integer.MIN_VALUE));
        assertEquals(0, AttackDamage.magnitude(-1));
    }

    @Test
    void exaggeratedPacketsAreCappedRegardlessOfCriticalFlag() {
        assertEquals(5000, AttackDamage.cap(2_000_000_000, 1000));
        assertEquals(5000, AttackDamage.cap(2_000_000_000 | Integer.MIN_VALUE, 1000));
        assertEquals(1200, AttackDamage.cap(1200, 1000));
    }

    @Test
    void invalidOrLargeEstimatesCannotOverflow() {
        assertEquals(0, AttackDamage.cap(100, -1));
        assertEquals(100, AttackDamage.cap(100, Long.MAX_VALUE));
    }


}
