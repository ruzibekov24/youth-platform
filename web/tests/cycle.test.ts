import assert from "node:assert/strict";
import { test } from "node:test";
import { ageAllowed, cycleState, neededToStart, retention, seatsLeft, weekOf } from "../lib/cycle.ts";

const base = { seats: 8 as number | null, min_to_start: 5, starts_on: "2026-10-20" as string | null, cycle_weeks: 4 as number | null };
const before = new Date("2026-10-10T10:00:00Z");

test("seatsLeft va neededToStart", () => {
  assert.equal(seatsLeft(8, 3), 5);
  assert.equal(seatsLeft(8, 9), 0);
  assert.equal(seatsLeft(null, 99), null);
  assert.equal(neededToStart(5, 3), 2);
  assert.equal(neededToStart(5, 7), 0);
});

test("cycleState: none, needs, ready, full, running", () => {
  assert.equal(cycleState({ ...base, starts_on: null }, 3, before), "none");
  assert.equal(cycleState(base, 3, before), "needs");
  assert.equal(cycleState(base, 5, before), "ready");
  assert.equal(cycleState(base, 8, before), "full");
  assert.equal(cycleState(base, 6, new Date("2026-10-21T10:00:00Z")), "running");
});

test("weekOf: Toshkent yarim kechasidan, 1..weeks, tugagach weeks+1", () => {
  assert.equal(weekOf("2026-10-20", 4, new Date("2026-10-19T18:59:00Z")), 0); // 23:59 Toshkent, hali boshlanmagan
  assert.equal(weekOf("2026-10-20", 4, new Date("2026-10-19T19:00:00Z")), 1); // 00:00 Toshkent
  assert.equal(weekOf("2026-10-20", 4, new Date("2026-10-27T10:00:00Z")), 2);
  assert.equal(weekOf("2026-10-20", 4, new Date("2026-11-30T10:00:00Z")), 5);
});

test("ageAllowed: yosh guruhlari aralashmaydi", () => {
  assert.equal(ageAllowed(null, null), true);
  assert.equal(ageAllowed("under18", "13-15"), true);
  assert.equal(ageAllowed("under18", "16-17"), true);
  assert.equal(ageAllowed("under18", "18-25"), false);
  assert.equal(ageAllowed("adult", "18-25"), true);
  assert.equal(ageAllowed("adult", "16-17"), false);
  assert.equal(ageAllowed("adult", null), false);
});

test("retention: oxirgi / birinchi", () => {
  assert.equal(retention([8, 7, 6, 6]), 75);
  assert.equal(retention([8]), null);
  assert.equal(retention([0, 3]), null);
});
