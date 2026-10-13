def cap(value: number, minimum: number, maximum: number):
    # Ensures that a given value is constrained within a specified minimum and maximum range.
    return max(minimum, min(maximum, value))
def calc_score():
    # Calculates and updates the game score based on the pet's most important factors of life.
    game.set_score(game.score() + (age * 10 + happiness / 10))
def cap_stats():
    global happiness, energy, hunger
    # Caps the pet's stats (happiness, energy, hunger) to ensure they remain within the range of 0 to 100.
    happiness = cap(happiness, 0, 100)
    energy = cap(energy, 0, 100)
    hunger = cap(hunger, 0, 100)

def on_command_received():
    if myController.button_was_pressed("1"):
        if energy < 55:
            sleep()
        else:
            timer(500, "clean_poop")
    if myController.button_was_pressed("3"):
        jump()
    if myController.button_was_pressed("4"):
        timer(500, "feed")
myController.on_command_received(on_command_received)

def poop():
    global poop_count
    # Increases the pet's poop count and updates the LED display to reflect the new poop count.
    led.plot(0, 4 - poop_count)
    poop_count = cap(poop_count + 1, 0, 4)

def on_setup_confirmation_mode_no_require():
    myController.apply_settings("""
        vc;init;
        vc;pref;60;
        vc;legoHub;0;0;;500;500;
        vc;sl;0;0;255;1;0;0;1;32;1;8;;power;%5B%5D;
        vc;b;1;1;2;<i class="fa-solid fa-poo"></i>;%7B%22pressed%22%3A%5B%5D%2C%22released%22%3A%5B%5D%7D;
        vc;b;3;1;3;<i class="fa-solid fa-basketball"></i>;%7B%22pressed%22%3A%5B%5D%2C%22released%22%3A%5B%5D%7D;
        vc;b;4;1;4;<i class="fa-solid fa-drumstick-bite"></i>;%7B%22pressed%22%3A%5B%5D%2C%22released%22%3A%5B%5D%7D;
        vc;show;sl,br,bl;
        """)
myController.on_setup(myController.ConfirmationMode.NO_REQUIRE,
    on_setup_confirmation_mode_no_require)

def timer(time: number, _function: str):
    global current_time, poop_timer, last_pooped, last_clean_poop, last_stats, last_fed, last_scored, last_aged, age, last_jumped, pet_y, jumping, sleep_time, sleep_stage, energy, sleeping
    # Game's main timer function, which checks if a specified amount of time has passed since the last occurrence of a given event.
    # If the time has passed, it triggers the corresponding function (e.g., pooping, feeding, jumping, etc.) and updates the last occurrence time for that event.
    current_time = control.millis()
    if _function == "Poop":
        if current_time > time + last_pooped:
            poop_timer = curve_generator(5000, 30000)
            last_pooped = control.millis()
            poop()
    elif _function == "clean_poop":
        if current_time > time + last_clean_poop:
            last_clean_poop = control.millis()
            clean_poop()
    elif _function == "calc_stats":
        if current_time > time + last_stats:
            last_stats = control.millis()
            calc_stats()
    elif _function == "feed":
        if current_time > time + last_fed:
            last_fed = control.millis()
            feed()
    elif _function == "score":
        if current_time > time + last_scored:
            last_scored = control.millis()
            calc_score()
    elif _function == "age":
        if current_time > time + last_aged:
            last_aged = control.millis()
            age += 1
            music._play_default_background(music.built_in_playable_melody(Melodies.BA_DING),
                music.PlaybackMode.UNTIL_DONE)
    elif _function == "jump":
        if current_time > time + last_jumped:
            last_jumped = control.millis()
            jump()
    elif _function == "jumpDown":
        if current_time > time + jump_start:
            pet_y = 3
            plot_pet()
            jumping = False
    elif _function == "wake":
        if current_time > time + sleep_time:
            sleep_time = control.millis()
            sleep_stage = sleep_stage + 1
            energy = energy + 4.5
            if sleep_stage == 10:
                sleeping = False
                pet_y = 3
                plot_pet()
def sleep():
    global pet_y, sleep_time, sleep_stage, sleeping
    # Puts the pet to sleep.
    pet_y = 4
    # This creates a sence of sleeping because the pet looks shorter on screen
    plot_pet()
    sleep_time = control.millis()
    sleep_stage = 0
    sleeping = True
def plot_pet():
    global i, pet_old_y, pet_old_x
    # Plots the pet on the LED display based on its current position (pet_x, pet_y).
    i = pet_old_x
    while i < pet_old_x + 2:
        y = pet_old_y
        while y < pet_old_y + 2:
            led.unplot(cap(i, 0, 4), cap(y, 0, 4))
            y += 1
        i += 1
    i = pet_x
    while i < pet_x + 2:
        y = pet_y
        while y < pet_y + 2:
            led.plot(cap(i, 0, 4), cap(y, 0, 4))
            y += 1
        i += 1
    pet_old_y = pet_y
    pet_old_x = pet_x
def calc_death():
    # Checks the pet's stats to determine if it has died. If any of the critical stats
    # (poop count, hunger, energy, happiness, or age) reach a fatal level, the game ends.
    if poop_count >= 3 or (hunger <= 0 or energy <= 0 or happiness <= 0 or age >= LIFE_EXPECTENCY):
        music.stop_melody(MelodyStopOptions.ALL)
        basic.clear_screen()
        music._play_default_background(music.built_in_playable_melody(Melodies.WAWAWAWAA),
            music.PlaybackMode.UNTIL_DONE)
        basic.show_icon(IconNames.SKULL)
        music._play_default_background(music.built_in_playable_melody(Melodies.FUNK),
            music.PlaybackMode.LOOPING_IN_BACKGROUND)
        game.game_over()
def feed():
    global food_count
    # Feeds the pet, increasing its food count.
    led.plot(4, 4 - food_count)
    food_count = cap(food_count + 1, 0, 4)
def jump():
    global pet_y, jumping, jump_start, energy, hunger, happiness
    # Makes the pet jump if it is playful and has enough energy.
    if personality_use_calc(20, 0.05) < PLAYFULNESS and energy > 50:
        pet_y = 2
        plot_pet()
        jumping = True
        jump_start = control.millis()
        energy += -15
        hunger += -15
        happiness += 25
def clean_poop():
    global poop_count
    # Cleans the pet's poop. If the pet is too aggressive, it may refuse to clean the poop, and the poop count will remain the same.
    # If the pet is not aggressive and there is poop to clean, the poop count will always decrease
    if personality_use_calc(35, 0.05) > AGGRESSION and poop_count >= 1:
        poop_count += -1
        led.unplot(0, 4 - poop_count)
def eat():
    global food_count, hunger
    # Allows the pet to eat food if it is hungry and there is food available.
    # Eating increases the pet's hunger stat and decreases the food count.
    if food_count >= 1:
        led.unplot(4, 4 - food_count)
        food_count += -1
        hunger += 15
        # If still hungery, and there is food, it will eat it all
        if hunger < 100 and food_count >= 1:
            eat()
def personality_use_calc(curve: number, luckModifier: number):
    # Generates a random value based on a curve and a luck modifier, which is influenced by the player's luck.
    return curve_generator(curve + randint(0, luckModifier * PLAYER_LUCK), 100)
def curve_generator(minimum2: number, maximum2: number):
    global total
    # Generates a random value that simulates a bell curve distribution by summing multiple random values.
    # This function acts as a simple replacement for the bell curve since The
    # bell curve takes too much computational work, and gives near same results.
    total = 0
    for index in range(5):
        total += randint(minimum2 / 5, maximum2 / 5)
    return total
def calc_stat_rates():
    global hunger_rate, energy_rate, happiness_rate
    # Calculates the rates at which the pet's stats change over time.
    hunger_rate = cap(1 - happiness / 200 + age / 100 + energy / 75 - INTELIGENCE / 100,
        0.75,
        3)
    energy_rate = cap(1 + happiness / 75 + age / 100 - hunger / 75 + INTELIGENCE / 100,
        0.75,
        3)
    happiness_rate = cap(1 + hunger / 75 + age / 100 - energy / 200 - INTELIGENCE / 100,
        0.75,
        3)
def calc_stats():
    global happiness, energy, hunger
    # Calculates the pet's stats (happiness, energy, hunger) based on their respective rates
    calc_stat_rates()
    happiness += 0 - happiness_rate
    energy += 0 - energy_rate
    hunger += 0 - hunger_rate
frame_start = 0
elapsed = 0
total = 0
food_count = 0
i = 0
sleeping = False
sleep_stage = 0
sleep_time = 0
jumping = False
jump_start = 0
last_jumped = 0
last_aged = 0
last_scored = 0
last_fed = 0
last_stats = 0
last_clean_poop = 0
last_pooped = 0
current_time = 0
poop_count = 0
age = 0
pet_old_y = 0
pet_old_x = 0
pet_y = 0
pet_x = 0
poop_timer = 0
energy_rate = 0
hunger_rate = 0
happiness_rate = 0
energy = 0
hunger = 0
happiness = 0
INTELIGENCE = 0
PLAYFULNESS = 0
AGGRESSION = 0
PLAYER_LUCK = 0
LIFE_EXPECTENCY = 0
music._play_default_background(music.built_in_playable_melody(Melodies.ENTERTAINER),
    music.PlaybackMode.IN_BACKGROUND)
# Clock initialization
FRAME_INTERVAL = 50
# Personality initialization
LIFE_EXPECTENCY = curve_generator(10, 30)
PLAYER_LUCK = curve_generator(0, 100)
AGGRESSION = curve_generator(40, 100)
CURIOSITY = curve_generator(40, 100)
PLAYFULNESS = curve_generator(40, 100)
INTELIGENCE = curve_generator(40, 100)
OBEDIENCE = curve_generator(40, 100)
# Stats initialization
happiness = 100
hunger = 100
energy = 100
happiness_rate = 1
hunger_rate = 1
energy_rate = 1
# Game initialization
poop_timer = curve_generator(5000, 30000)
pet_x = 1
pet_y = 3
pet_old_x = 1
pet_old_y = 3
# Startup sequence
music.set_volume(32)
game.set_score(0)
basic.show_icon(IconNames.SMALL_DIAMOND)
basic.show_icon(IconNames.DIAMOND)
basic.show_icon(IconNames.SQUARE)
basic.clear_screen()
music._play_default_background(music.built_in_playable_melody(Melodies.NYAN),
    music.PlaybackMode.LOOPING_IN_BACKGROUND)
plot_pet()
# Player gets 2 food at the start of the game
feed()
feed()
myController.use_bluetooth()
myController.use_serial()

def on_forever():
    global elapsed, frame_start
    # Main game loop, this function is called every FRAME_INTERVAL milliseconds.
    # It handles the timing of various events in the game, such as:
    # pooping, feeding, jumping, and sleeping.
    # It also updates the pet's stats and checks for death conditions.
    timer(poop_timer, "Poop")
    timer(2000, "calc_stats")
    if jumping:
        timer(500, "jumpDown")
    elif sleeping:
        timer(500, "wake")
    elif input.button_is_pressed(Button.A):
        timer(500, "feed")
    elif input.button_is_pressed(Button.B):
        if energy < 55:
            sleep()
        else:
            timer(500, "clean_poop")
    elif input.logo_is_pressed():
        jump()
    if hunger < 75 + CURIOSITY / 10:
        eat()
    timer(5000, "score")
    timer(20000, "age")
    cap_stats()
    calc_death()
    elapsed = control.millis() - frame_start
    if elapsed < FRAME_INTERVAL:
        basic.pause(FRAME_INTERVAL - elapsed)
    # frame_start is calculated at the end of the frame to ensure that
    # the timing of events is accurate. This accounts for any delays
    # caused by other functions or processes running on the micro:bit,
    # ensuring that the game loop maintains a consistent frame rate
    # and that events occur at the intended intervals.
    frame_start = control.millis()
basic.forever(on_forever)
