function cap (value: number, minimum: number, maximum: number) {
    // Ensures that a given value is constrained within a specified minimum and maximum range.
    return Math.max(minimum, Math.min(maximum, value))
}
function calc_score () {
    // Calculates and updates the game score based on the pet's most important factors of life.
    game.setScore(game.score() + (age * 10 + happiness / 10))
}
function cap_stats () {
    // Caps the pet's stats (happiness, energy, hunger) to ensure they remain within the range of 0 to 100.
    happiness = cap(happiness, 0, 100)
    energy = cap(energy, 0, 100)
    hunger = cap(hunger, 0, 100)
}
myController.onCommandReceived(function () {
    if (myController.buttonWasPressed("1")) {
        if (energy < 55) {
            sleep()
        } else {
            timer(500, "clean_poop")
        }
    }
    if (myController.buttonWasPressed("3")) {
        jump()
    }
    if (myController.buttonWasPressed("4")) {
        timer(500, "feed")
    }
})
function poop () {
    // Increases the pet's poop count and updates the LED display to reflect the new poop count.
    led.plot(0, 4 - poop_count)
    poop_count = cap(poop_count + 1, 0, 4)
}
myController.onSetup(myController.ConfirmationMode.NoRequire, function () {
    myController.applySettings(`
    vc;init;
    vc;pref;60;
    vc;legoHub;0;0;;500;500;
    vc;sl;0;0;255;1;0;0;1;32;1;8;;power;%5B%5D;
    vc;b;1;1;2;<i class="fa-solid fa-poo"></i>;%7B%22pressed%22%3A%5B%5D%2C%22released%22%3A%5B%5D%7D;
    vc;b;3;1;3;<i class="fa-solid fa-basketball"></i>;%7B%22pressed%22%3A%5B%5D%2C%22released%22%3A%5B%5D%7D;
    vc;b;4;1;4;<i class="fa-solid fa-drumstick-bite"></i>;%7B%22pressed%22%3A%5B%5D%2C%22released%22%3A%5B%5D%7D;
    vc;show;sl,br,bl;`)
})
function timer (time: number, _function: string) {
    // Game's main timer function, which checks if a specified amount of time has passed since the last occurrence of a given event.
    // If the time has passed, it triggers the corresponding function (e.g., pooping, feeding, jumping, etc.) and updates the last occurrence time for that event.
    current_time = control.millis()
    if (_function == "Poop") {
        if (current_time > time + last_pooped) {
            poop_timer = curve_generator(5000, 30000)
            last_pooped = control.millis()
            poop()
        }
    } else if (_function == "clean_poop") {
        if (current_time > time + last_clean_poop) {
            last_clean_poop = control.millis()
            clean_poop()
        }
    } else if (_function == "calc_stats") {
        if (current_time > time + last_stats) {
            last_stats = control.millis()
            calc_stats()
        }
    } else if (_function == "feed") {
        if (current_time > time + last_fed) {
            last_fed = control.millis()
            feed()
        }
    } else if (_function == "score") {
        if (current_time > time + last_scored) {
            last_scored = control.millis()
            calc_score()
        }
    } else if (_function == "age") {
        if (current_time > time + last_aged) {
            last_aged = control.millis()
            age += 1
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.UntilDone)
        }
    } else if (_function == "jump") {
        if (current_time > time + last_jumped) {
            last_jumped = control.millis()
            jump()
        }
    } else if (_function == "jumpDown") {
        if (current_time > time + jump_start) {
            pet_y = 3
            plot_pet()
            jumping = false
        }
    } else if (_function == "wake") {
        if (current_time > time + sleep_time) {
            sleep_time = control.millis()
            sleep_stage = sleep_stage + 1
            energy = energy + 4.5
            if (sleep_stage == 10) {
                sleeping = false
                pet_y = 3
                plot_pet()
            }
        }
    }
}
function sleep () {
    // Puts the pet to sleep.
    pet_y = 4
    // This creates a sence of sleeping because the pet looks shorter on screen
    plot_pet()
    sleep_time = control.millis()
    sleep_stage = 0
    sleeping = true
}
function plot_pet () {
    let y: number;
// Plots the pet on the LED display based on its current position (pet_x, pet_y).
    i = pet_old_x
    while (i < pet_old_x + 2) {
        y = pet_old_y
        while (y < pet_old_y + 2) {
            led.unplot(cap(i, 0, 4), cap(y, 0, 4))
            y += 1
        }
        i += 1
    }
    i = pet_x
    while (i < pet_x + 2) {
        y = pet_y
        while (y < pet_y + 2) {
            led.plot(cap(i, 0, 4), cap(y, 0, 4))
            y += 1
        }
        i += 1
    }
    pet_old_y = pet_y
    pet_old_x = pet_x
}
function calc_death () {
    // Checks the pet's stats to determine if it has died. If any of the critical stats
    // (poop count, hunger, energy, happiness, or age) reach a fatal level, the game ends.
    if (poop_count >= 3 || (hunger <= 0 || energy <= 0 || happiness <= 0 || age >= LIFE_EXPECTENCY)) {
        music.stopMelody(MelodyStopOptions.All)
        basic.clearScreen()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Skull)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.LoopingInBackground)
        game.gameOver()
    }
}
function feed () {
    // Feeds the pet, increasing its food count.
    led.plot(4, 4 - food_count)
    food_count = cap(food_count + 1, 0, 4)
}
function jump () {
    // Makes the pet jump if it is playful and has enough energy.
    if (personality_use_calc(20, 0.05) < PLAYFULNESS && energy > 50) {
        pet_y = 2
        plot_pet()
        jumping = true
        jump_start = control.millis()
        energy += -15
        hunger += -15
        happiness += 25
    }
}
function clean_poop () {
    // Cleans the pet's poop. If the pet is too aggressive, it may refuse to clean the poop, and the poop count will remain the same.
    // If the pet is not aggressive and there is poop to clean, the poop count will always decrease
    if (personality_use_calc(35, 0.05) > AGGRESSION && poop_count >= 1) {
        poop_count += -1
        led.unplot(0, 4 - poop_count)
    }
}
function eat () {
    // Allows the pet to eat food if it is hungry and there is food available.
    // Eating increases the pet's hunger stat and decreases the food count.
    if (food_count >= 1) {
        led.unplot(4, 4 - food_count)
        food_count += -1
        hunger += 15
        // If still hungery, and there is food, it will eat it all
        if (hunger < 100 && food_count >= 1) {
            eat()
        }
    }
}
function personality_use_calc (curve: number, luckModifier: number) {
    // Generates a random value based on a curve and a luck modifier, which is influenced by the player's luck.
    return curve_generator(curve + randint(0, luckModifier * PLAYER_LUCK), 100)
}
function curve_generator (minimum2: number, maximum2: number) {
    // Generates a random value that simulates a bell curve distribution by summing multiple random values.
    // This function acts as a simple replacement for the bell curve since The
    // bell curve takes too much computational work, and gives near same results.
    total = 0
    for (let index = 0; index < 5; index++) {
        total += randint(minimum2 / 5, maximum2 / 5)
    }
    return total
}
function calc_stat_rates () {
    // Calculates the rates at which the pet's stats change over time.
    hunger_rate = cap(1 - happiness / 200 + age / 100 + energy / 75 - INTELIGENCE / 100, 0.75, 3)
    energy_rate = cap(1 + happiness / 75 + age / 100 - hunger / 75 + INTELIGENCE / 100, 0.75, 3)
    happiness_rate = cap(1 + hunger / 75 + age / 100 - energy / 200 - INTELIGENCE / 100, 0.75, 3)
}
function calc_stats () {
    // Calculates the pet's stats (happiness, energy, hunger) based on their respective rates
    calc_stat_rates()
    happiness += 0 - happiness_rate
    energy += 0 - energy_rate
    hunger += 0 - hunger_rate
}
let frame_start = 0
let elapsed = 0
let total = 0
let food_count = 0
let i = 0
let sleeping = false
let sleep_stage = 0
let sleep_time = 0
let jumping = false
let jump_start = 0
let last_jumped = 0
let last_aged = 0
let last_scored = 0
let last_fed = 0
let last_stats = 0
let last_clean_poop = 0
let last_pooped = 0
let current_time = 0
let poop_count = 0
let age = 0
let pet_old_y = 0
let pet_old_x = 0
let pet_y = 0
let pet_x = 0
let poop_timer = 0
let energy_rate = 0
let hunger_rate = 0
let happiness_rate = 0
let energy = 0
let hunger = 0
let happiness = 0
let INTELIGENCE = 0
let PLAYFULNESS = 0
let AGGRESSION = 0
let PLAYER_LUCK = 0
let LIFE_EXPECTENCY = 0
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
// Clock initialization
let FRAME_INTERVAL = 50
// Personality initialization
LIFE_EXPECTENCY = curve_generator(10, 30)
PLAYER_LUCK = curve_generator(0, 100)
AGGRESSION = curve_generator(40, 100)
let CURIOSITY = curve_generator(40, 100)
PLAYFULNESS = curve_generator(40, 100)
INTELIGENCE = curve_generator(40, 100)
let OBEDIENCE = curve_generator(40, 100)
// Stats initialization
happiness = 100
hunger = 100
energy = 100
happiness_rate = 1
hunger_rate = 1
energy_rate = 1
// Game initialization
poop_timer = curve_generator(5000, 30000)
pet_x = 1
pet_y = 3
pet_old_x = 1
pet_old_y = 3
// Startup sequence
music.setVolume(32)
game.setScore(0)
basic.showIcon(IconNames.SmallDiamond)
basic.showIcon(IconNames.Diamond)
basic.showIcon(IconNames.Square)
basic.clearScreen()
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Nyan), music.PlaybackMode.LoopingInBackground)
plot_pet()
// Player gets 2 food at the start of the game
feed()
feed()
myController.useBluetooth()
myController.useSerial()
basic.forever(function () {
    // Main game loop, this function is called every FRAME_INTERVAL milliseconds.
    // It handles the timing of various events in the game, such as:
    // pooping, feeding, jumping, and sleeping.
    // It also updates the pet's stats and checks for death conditions.
    timer(poop_timer, "Poop")
    timer(2000, "calc_stats")
    if (jumping) {
        timer(500, "jumpDown")
    } else if (sleeping) {
        timer(500, "wake")
    } else if (input.buttonIsPressed(Button.A)) {
        timer(500, "feed")
    } else if (input.buttonIsPressed(Button.B)) {
        if (energy < 55) {
            sleep()
        } else {
            timer(500, "clean_poop")
        }
    } else if (input.logoIsPressed()) {
        jump()
    }
    if (hunger < 75 + CURIOSITY / 10) {
        eat()
    }
    timer(5000, "score")
    timer(20000, "age")
    cap_stats()
    calc_death()
    elapsed = control.millis() - frame_start
    if (elapsed < FRAME_INTERVAL) {
        basic.pause(FRAME_INTERVAL - elapsed)
    }
    // frame_start is calculated at the end of the frame to ensure that
    // the timing of events is accurate. This accounts for any delays
    // caused by other functions or processes running on the micro:bit,
    // ensuring that the game loop maintains a consistent frame rate
    // and that events occur at the intended intervals.
    frame_start = control.millis()
})
