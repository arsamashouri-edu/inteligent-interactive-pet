def cap(value: number, minimum: number, maximum: number):
    return max(minimum, min(maximum, value))
def plot_pet():
    global x, pet_old_y, pet_old_x
    x = pet_old_x
    while x < pet_old_x + 2:
        y = pet_old_y
        while y < pet_old_y + 2:
            led.unplot(cap(x, 0, 4), cap(y, 0, 4))
            y += 1
        x += 1
    x = pet_x
    while x < pet_x + 2:
        y = pet_y
        while y < pet_y + 2:
            led.plot(cap(x, 0, 4), cap(y, 0, 4))
            y += 1
        x += 1
    pet_old_y = pet_y
    pet_old_x = pet_x
def personality_use_calc(curve: number, luckModifier: number):
    return curve_generator(curve + randint(0, luckModifier * player_luck), 100)
def calc_score():
    game.set_score(game.score() + (age * 10 + happiness / 10))
def curve_generator(minimum2: number, maximum2: number):
    global total
    # This function acts as a simple replacement for the bell curve since The
    # bell curve takes too much computational work, and gives near same results.
    total = 0
    for index in range(5):
        total += randint(minimum2 / 5, maximum2 / 5)
    return total
def calc_stat_rates():
    global hunger_rate, energy_rate, happiness_rate
    hunger_rate = cap(1 - happiness / 200 + age / 100 + energy / 75 - INTELIGENCE / 100,
        0.75,
        3)
    energy_rate = cap(1 + happiness / 75 + age / 100 - hunger / 75 + INTELIGENCE / 100,
        0.75,
        3)
    happiness_rate = cap(1 + hunger / 75 + age / 100 - energy / 200 - INTELIGENCE / 100,
        0.75,
        3)
def feed():
    global food_count
    led.plot(4, 4 - food_count)
    food_count = cap(food_count + 1, 0, 4)
def sleep():
    global pet_y, sleep_time, sleep_stage, sleeping
    pet_y = 4
    plot_pet()
    sleep_time = control.millis()
    sleep_stage = 0
    sleeping = True
# This creates a sence of sleeping because the pet looks shorter on screen
def jump():
    global pet_y, jumping, jump_start, energy, hunger, happiness
    if personality_use_calc(20, 0.05) < PLAYFULNESS and energy > 50:
        pet_y = 2
        plot_pet()
        jumping = True
        jump_start = control.millis()
        energy += -15
        hunger += -15
        happiness += 25
def cap_stats():
    global happiness, energy, hunger
    happiness = cap(happiness, 0, 100)
    energy = cap(energy, 0, 100)
    hunger = cap(hunger, 0, 100)
# The game runs only on 1 clock, this function uses
# only 1 clock to check for several events that happen
# throughout the game
def timer(time: number, _function: str):
    global current_time, poop_timer, last_pooped, last_clean_poop, last_stats, last_fed, last_scored, last_aged, age, last_jumped, pet_y, jumping, sleep_time, sleep_stage, energy, sleeping
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
    elif _function == "Score":
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
    elif _function == "Wakeup":
        if current_time > time + sleep_time:
            sleep_time = control.millis()
            sleep_stage = sleep_stage + 1
            energy = energy + 4.5
            if sleep_stage == 10:
                sleeping = False
                pet_y = 3
                plot_pet()
def calc_death():
    # Instead of a normal calc_death value, this function checks every stat needed for survival
    if poop_count >= 3 or (hunger <= 0 or energy <= 0 or happiness <= 0 or age >= life_expectency):
        music.stop_melody(MelodyStopOptions.ALL)
        basic.clear_screen()
        music._play_default_background(music.built_in_playable_melody(Melodies.WAWAWAWAA),
            music.PlaybackMode.UNTIL_DONE)
        basic.show_icon(IconNames.SKULL)
        music._play_default_background(music.built_in_playable_melody(Melodies.FUNK),
            music.PlaybackMode.LOOPING_IN_BACKGROUND)
        game.game_over()
def eat():
    global food_count, hunger
    if food_count >= 1:
        led.unplot(4, 4 - food_count)
        food_count += -1
        hunger += 15
        # If still hungery, and there is food, it will eat it all
        if hunger < 100 and food_count >= 1:
            eat()
def poop():
    global poop_count
    led.plot(0, 4 - poop_count)
    poop_count = cap(poop_count + 1, 0, 4)
def calc_stats():
    global happiness, energy, hunger
    calc_stat_rates()
    happiness += 0 - happiness_rate
    energy += 0 - energy_rate
    hunger += 0 - hunger_rate
def clean_poop():
    global poop_count
    if personality_use_calc(35, 0.05) > AGGRESSION and poop_count >= 1:
        poop_count += -1
        led.unplot(0, 4 - poop_count)
frame_start = 0
elapsed = 0
poop_count = 0
last_jumped = 0
last_aged = 0
last_scored = 0
last_fed = 0
last_stats = 0
last_clean_poop = 0
last_pooped = 0
current_time = 0
jump_start = 0
jumping = False
sleeping = False
sleep_stage = 0
sleep_time = 0
food_count = 0
total = 0
age = 0
pet_old_y = 0
pet_old_x = 0
x = 0
player_luck = 0
life_expectency = 0
pet_x = 0
pet_y = 0
energy_rate = 0
hunger_rate = 0
happiness_rate = 0
energy = 0
hunger = 0
happiness = 0
basic.show_icon(IconNames.SMALL_DIAMOND)
music.set_volume(32)
music._play_default_background(music.built_in_playable_melody(Melodies.ENTERTAINER),
    music.PlaybackMode.IN_BACKGROUND)
FRAME_INTERVAL = 50
happiness = 100
hunger = 100
energy = 100
AGGRESSION = curve_generator(40, 100)
CURIOSITY = curve_generator(40, 100)
PLAYFULNESS = curve_generator(40, 100)
INTELIGENCE = curve_generator(40, 100)
OBEDIENCE = curve_generator(40, 100)
poop_timer = curve_generator(5000, 30000)
happiness_rate = 1
hunger_rate = 1
energy_rate = 1
pet_y = 3
pet_x = 1
life_expectency = curve_generator(10, 30)
player_luck = curve_generator(0, 100)
timerrr = control.millis()
game.set_score(0)
basic.show_icon(IconNames.DIAMOND)
basic.show_icon(IconNames.SQUARE)
basic.clear_screen()
music._play_default_background(music.built_in_playable_melody(Melodies.NYAN),
    music.PlaybackMode.LOOPING_IN_BACKGROUND)
feed()
feed()
plot_pet()

def on_forever():
    global elapsed, frame_start
    timer(poop_timer, "Poop")
    timer(2000, "calc_stats")
    if jumping:
        timer(500, "jumpDown")
    elif sleeping:
        timer(500, "Wakeup")
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
    timer(5000, "Score")
    timer(20000, "age")
    cap_stats()
    calc_death()
    elapsed = control.millis() - frame_start
    if elapsed < FRAME_INTERVAL:
        basic.pause(FRAME_INTERVAL - elapsed)
    # frame_start is calculated at the end of the frame
    # This is done because the microbit does other functions
    # Between the forever loops
    frame_start = control.millis()
basic.forever(on_forever)
