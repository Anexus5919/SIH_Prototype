// const Course = require('../../lib/models/Course');
// const Faculty = require('../../lib/models/Faculty');
// const Room = require('../../lib/models/Room');

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]; // Standardized time format

class TimetableGenerator {
  // Update constructor to accept and store constraints
  constructor(courses, faculty, rooms, constraints) {
    this.courses = courses;
    this.faculty = faculty;
    this.rooms = rooms;
    this.constraints = constraints || {}; // Use empty object as fallback
    this.population = [];
    this.populationSize = 50;
    this.generations = 30;
  }

  // Main function to run the algorithm
  async run() {
    this.initializePopulation();
    for (let i = 0; i < this.generations; i++) {
      this.calculateFitness();
      this.selection();
      this.crossover();
      this.mutation();
      console.log(`Generation ${i + 1} best fitness: ${this.population.length > 0 ? this.population[0].fitness : 'N/A'}`);
    }
    this.calculateFitness();
    return this.population[0];
  }

  // --- ❗ KEY IMPROVEMENT ❗ ---
  // 1. Create a diverse and valid initial population
  initializePopulation() {
    // First, create a list of all individual class sessions that need to be scheduled
    // based on each course's required contact hours.
    const allSessions = [];
    for (const course of this.courses) {
      const hours = course.contactHours || 1; // Default to 1 hour if not specified
      for (let i = 0; i < hours; i++) {
        allSessions.push({ course: course._id });
      }
    }

    // Create a population of random timetables
    for (let i = 0; i < this.populationSize; i++) {
      let schedule = [];
      // Shuffle the sessions for randomness in each individual timetable
      const shuffledSessions = [...allSessions].sort(() => Math.random() - 0.5);

      for (const session of shuffledSessions) {
        // Assign a random day, time, faculty, and room to each required session
        const day = DAYS[Math.floor(Math.random() * DAYS.length)];
        const time = TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)];
        const randomFaculty = this.faculty[Math.floor(Math.random() * this.faculty.length)];
        const randomRoom = this.rooms[Math.floor(Math.random() * this.rooms.length)];

        schedule.push({
          day,
          time,
          course: session.course,
          faculty: randomFaculty._id,
          room: randomRoom._id,
        });
      }
      this.population.push({ schedule, fitness: 0 });
    }
  }

  // 2. Calculate the fitness score for each timetable
  calculateFitness() {
    const breakStart = this.constraints.breakStartTime ? parseInt(this.constraints.breakStartTime.split(':')[0]) : 13;
    const breakEnd = this.constraints.breakEndTime ? parseInt(this.constraints.breakEndTime.split(':')[0]) : 14;
    const maxHoursPerDay = this.constraints.maxHoursPerDay || 2;
    const maxConsecutive = this.constraints.maxConsecutiveClasses || 3;

    for (const individual of this.population) {
      let fitness = 100;
      const clashes = new Set();
      const dailyCourseCount = {};

      for (const slot of individual.schedule) {
        // --- HARD CONSTRAINTS ---
        const facultyClashKey = `${slot.day}-${slot.time}-${slot.faculty}`;
        if (clashes.has(facultyClashKey)) fitness -= 20;
        else clashes.add(facultyClashKey);

        const roomClashKey = `${slot.day}-${slot.time}-${slot.room}`;
        if (clashes.has(roomClashKey)) fitness -= 20;
        else clashes.add(roomClashKey);
        
        // --- SOFT CONSTRAINTS (from global settings) ---
        const slotTime = parseInt(slot.time.split(':')[0]);

        // Break Time Constraint
        if (slotTime >= breakStart && slotTime < breakEnd) {
          fitness -= 50;
        }

        // Max Hours Per Day Constraint
        const dayCourseKey = `${slot.day}-${slot.course}`;
        dailyCourseCount[dayCourseKey] = (dailyCourseCount[dayCourseKey] || 0) + 1;
        if (dailyCourseCount[dayCourseKey] > maxHoursPerDay) {
          fitness -= 15;
        }
      }
      
      // Max Consecutive Classes Constraint
      const facultySchedule = {};
      individual.schedule.forEach(slot => {
        if (!facultySchedule[slot.faculty]) facultySchedule[slot.faculty] = [];
        facultySchedule[slot.faculty].push(parseInt(slot.time.split(':')[0]));
      });

      for (const facultyId in facultySchedule) {
        const times = facultySchedule[facultyId].sort((a, b) => a - b);
        if (times.length <= maxConsecutive) continue;
        
        let consecutiveCount = 1;
        for (let i = 1; i < times.length; i++) {
          if (times[i] === times[i-1] + 1) {
            consecutiveCount++;
          } else {
            consecutiveCount = 1;
          }
          if (consecutiveCount > maxConsecutive) {
            fitness -= 10;
            break;
          }
        }
      }

      individual.fitness = Math.max(0, fitness);
    }
    this.population.sort((a, b) => b.fitness - a.fitness);
  }

  // 3. Select the best individuals for the next generation
  selection() {
    const eliteSize = Math.floor(this.populationSize * 0.2);
    this.population = this.population.slice(0, eliteSize);
  }

  // 4. Create new offspring by combining parents
  crossover() {
    const offspring = [];
    while (this.population.length > 0 && (this.population.length + offspring.length < this.populationSize)) {
      const parent1 = this.population[Math.floor(Math.random() * this.population.length)];
      const parent2 = this.population[Math.floor(Math.random() * this.population.length)];
      
      const crossoverPoint = Math.floor(Math.random() * (parent1.schedule.length || 0));
      const childSchedule = [
        ...parent1.schedule.slice(0, crossoverPoint),
        ...parent2.schedule.slice(crossoverPoint)
      ];
      offspring.push({ schedule: childSchedule, fitness: 0 });
    }
    this.population.push(...offspring);
  }

  // 5. Apply random changes to the offspring
  mutation() {
    const eliteSize = Math.floor(this.populationSize * 0.2);
    for (let i = eliteSize; i < this.population.length; i++) {
      if (Math.random() < 0.1) {
        const individual = this.population[i];
        if (individual.schedule.length > 0) {
            const mutationPoint = Math.floor(Math.random() * individual.schedule.length);
            individual.schedule[mutationPoint].day = DAYS[Math.floor(Math.random() * DAYS.length)];
            individual.schedule[mutationPoint].time = TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)];
        }
      }
    }
  }
}

module.exports = TimetableGenerator;