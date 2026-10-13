function cap(value: number, minimum: number, maximum: number): number {
    return Math.max(minimum, Math.min(maximum, value))
}

function plot_pet() {
    let y: number;
    
    x = pet_old_x
    while (x < pet_old_x + 2) {
        y = pet_old_y
        while (y < pet_old_y + 2) {
            led.unplot(cap(x, 0, 4), cap(y, 0, 4))
            y += 1
        }
        x += 1
    }
    x = pet_x
    while (x < pet_x + 2) {
        y = pet_y
        while (y < pet_y + 2) {
            led.plot(cap(x, 0, 4), cap(y, 0, 4))
            y += 1
        }
        x += 1
    }
    pet_old_y = pet_y
    pet_old_x = pet_x
}

function personality_use_calc(curve: number, luckModifier: number): number {
    return curve_generator(curve + randint(0, luckModifier * player_luck), 100)
}

function calc_score() {
    game.setScore(game.score() + (age * 10 + happiness / 10))
}

function curve_generator(minimum2: number, maximum2: number): number {
    
    //  This function acts as a simple replacement for the bell curve since The
    //  bell curve takes too much computational work, and gives near same results.
    total = 0
    for (let index = 0; index < 5; index++) {
        total += randint(minimum2 / 5, maximum2 / 5)
    }
    return total
}

function calc_stat_rates() {
    
    hunger_rate = cap(1 - happiness / 200 + age / 100 + energy / 75 - INTELIGENCE / 100, 0.75, 3)
    energy_rate = cap(1 + happiness / 75 + age / 100 - hunger / 75 + INTELIGENCE / 100, 0.75, 3)
    happiness_rate = cap(1 + hunger / 75 + age / 100 - energy / 200 - INTELIGENCE / 100, 0.75, 3)
}

function feed() {
    
    led.plot(4, 4 - food_count)
    food_count = cap(food_count + 1, 0, 4)
}

function sleep() {
    
    pet_y = 4
    plot_pet()
    sleep_time = control.millis()
    sleep_stage = 0
    sleeping = true
}

//  This creates a sence of sleeping because the pet looks shorter on screen
function jump() {
    
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

function cap_stats() {
    
    happiness = cap(happiness, 0, 100)
    energy = cap(energy, 0, 100)
    hunger = cap(hunger, 0, 100)
}

//  The game runs only on 1 clock, this function uses
//  only 1 clock to check for several events that happen
//  throughout the game
function timer(time: number, _function: string) {
    
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
        
    } else if (_function == "Score") {
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
        
    } else if (_function == "Wakeup") {
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

function calc_death() {
    //  Instead of a normal calc_death value, this function checks every stat needed for survival
    if (poop_count >= 3 || (hunger <= 0 || energy <= 0 || happiness <= 0 || age >= life_expectency)) {
        music.stopMelody(MelodyStopOptions.All)
        basic.clearScreen()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Skull)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.LoopingInBackground)
        game.gameOver()
    }
    
}

function eat() {
    
    if (food_count >= 1) {
        led.unplot(4, 4 - food_count)
        food_count += -1
        hunger += 15
        //  If still hungery, and there is food, it will eat it all
        if (hunger < 100 && food_count >= 1) {
            eat()
        }
        
    }
    
}

function poop() {
    
    led.plot(0, 4 - poop_count)
    poop_count = cap(poop_count + 1, 0, 4)
}

function calc_stats() {
    
    calc_stat_rates()
    happiness += 0 - happiness_rate
    energy += 0 - energy_rate
    hunger += 0 - hunger_rate
}

function clean_poop() {
    
    if (personality_use_calc(35, 0.05) > AGGRESSION && poop_count >= 1) {
        poop_count += -1
        led.unplot(0, 4 - poop_count)
    }
    
}

let frame_start = 0
let elapsed = 0
let poop_count = 0
let last_jumped = 0
let last_aged = 0
let last_scored = 0
let last_fed = 0
let last_stats = 0
let last_clean_poop = 0
let last_pooped = 0
let current_time = 0
let jump_start = 0
let jumping = false
let sleeping = false
let sleep_stage = 0
let sleep_time = 0
let food_count = 0
let total = 0
let age = 0
let pet_old_y = 0
let pet_old_x = 0
let x = 0
let player_luck = 0
let life_expectency = 0
let pet_x = 0
let pet_y = 0
let energy_rate = 0
let hunger_rate = 0
let happiness_rate = 0
let energy = 0
let hunger = 0
let happiness = 0
basic.showIcon(IconNames.SmallDiamond)
music.setVolume(32)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
let FRAME_INTERVAL = 50
happiness = 100
hunger = 100
energy = 100
let AGGRESSION = curve_generator(40, 100)
let CURIOSITY = curve_generator(40, 100)
let PLAYFULNESS = curve_generator(40, 100)
let INTELIGENCE = curve_generator(40, 100)
let OBEDIENCE = curve_generator(40, 100)
let poop_timer = curve_generator(5000, 30000)
happiness_rate = 1
hunger_rate = 1
energy_rate = 1
pet_y = 3
pet_x = 1
life_expectency = curve_generator(10, 30)
player_luck = curve_generator(0, 100)
let timerrr = control.millis()
game.setScore(0)
basic.showIcon(IconNames.Diamond)
basic.showIcon(IconNames.Square)
basic.clearScreen()
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Nyan), music.PlaybackMode.LoopingInBackground)
feed()
feed()
plot_pet()
basic.forever(function on_forever() {
    
    timer(poop_timer, "Poop")
    timer(2000, "calc_stats")
    if (jumping) {
        timer(500, "jumpDown")
    } else if (sleeping) {
        timer(500, "Wakeup")
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
    
    timer(5000, "Score")
    timer(20000, "age")
    cap_stats()
    calc_death()
    elapsed = control.millis() - frame_start
    if (elapsed < FRAME_INTERVAL) {
        basic.pause(FRAME_INTERVAL - elapsed)
    }
    
    //  frame_start is calculated at the end of the frame
    //  This is done because the microbit does other functions
    //  Between the forever loops
    frame_start = control.millis()
})
