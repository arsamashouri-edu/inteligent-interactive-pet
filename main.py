def Cap(value: number, minimum: number, maximum: number):
    return max(minimum, min(maximum, value))
def PlotPet():
    global PetOldY, PetOldX
    led.unplot(Cap(PetOldX, 0, 4), Cap(PetOldY, 0, 4))
    led.unplot(Cap(PetOldX, 0, 4), Cap(PetOldY + 1, 0, 4))
    led.unplot(Cap(PetOldX + 1, 0, 4), Cap(PetOldY, 0, 4))
    led.unplot(Cap(PetOldX + 1, 0, 4), Cap(PetOldY + 1, 0, 4))
    led.plot(Cap(PetX, 0, 4), Cap(PetY, 0, 4))
    led.plot(Cap(PetX, 0, 4), Cap(PetY + 1, 0, 4))
    led.plot(Cap(PetX + 1, 0, 4), Cap(PetY, 0, 4))
    led.plot(Cap(PetX + 1, 0, 4), Cap(PetY + 1, 0, 4))
    PetOldY = PetY
    PetOldX = PetX
def PersonalityUseCalc(curve: number, luckModifier: number):
    return CurveGenerator(curve + randint(0, luckModifier * PlayerLuck), 100)
def CalcScore():
    game.set_score(game.score() + (Age * 10 + Hapiness / 10))
def CurveGenerator(minimum2: number, maximum2: number):
    global total
    # This function acts as a simple replacement for the bell curve since The
    # bell curve takes too much computational work, and gives near same results.
    total = 0
    for index in range(5):
        total += randint(minimum2 / 5, maximum2 / 5)
    return total
def CalcStatRates():
    global HungerRate, EnergyRate, HappinessRate, ThirstRate
    HungerRate = Cap(1 - Hapiness / 200 + Age / 100 + Energy / 75 - Intelligence / 100,
        0.75,
        3)
    EnergyRate = Cap(1 + Hapiness / 75 + Age / 100 - Hunger / 75 + Intelligence / 100,
        0.75,
        3)
    HappinessRate = Cap(1 + Hunger / 75 + Age / 100 - Energy / 200 - Intelligence / 100,
        0.75,
        3)
    ThirstRate = Cap(1 + Age / 100 + Energy / 75 - Intelligence / 100, 0.75, 3)
def Feed():
    global FoodCount
    led.plot(4, 4 - FoodCount)
    FoodCount += 1
def Sleep():
    global PetY
    PetY = 4
# This creates a sence of sleeping because the pet looks shorter on screen
def Jump():
    global PetY, Energy, Hunger
    if PersonalityUseCalc(50, 0.05) < Playfulness and Energy > 50:
        PetY = 2
        PlotPet()
        led.unplot(1, 4)
        led.unplot(2, 4)
        basic.pause(500)
        PetY = 3
        PlotPet()
        led.unplot(1, 2)
        led.unplot(2, 2)
        Energy += -15
        Hunger += -15
def capStats():
    global Hapiness, Energy, Hunger, Thirst
    Hapiness = Cap(Hapiness, 0, 100)
    Energy = Cap(Energy, 0, 100)
    Hunger = Cap(Hunger, 0, 100)
    Thirst = Cap(Thirst, 0, 100)
# The game runs only on 1 clock, this function uses
# only 1 clock to check for several events that happen
# throughout the game
def Timer(time: number, _function: str):
    global runningTime, PoopTimer, LastPoop, LastCleanPoop, LastStats, LastFed, LastTBM, TopBarMode, LastBarFlash, LastScore, LastAge, Age, LastJump
    runningTime = control.millis()
    if _function == "Poop":
        if runningTime > time + LastPoop:
            PoopTimer = CurveGenerator(5000, 30000)
            LastPoop = control.millis()
            Poop()
    elif _function == "CleanPoop":
        if runningTime > time + LastCleanPoop:
            LastCleanPoop = control.millis()
            CleanPoop()
    elif _function == "CalcStats":
        if runningTime > time + LastStats:
            LastStats = control.millis()
            CalcStats()
    elif _function == "Feed":
        if runningTime > time + LastFed:
            LastFed = control.millis()
            Feed()
    elif _function == "TopBarMode":
        if runningTime > time + LastTBM:
            LastTBM = control.millis()
            TopBarMode = not (TopBarMode)
    elif _function == "BarFlash":
        if runningTime > time + LastBarFlash:
            LastBarFlash = control.millis()
    elif _function == "Score":
        if runningTime > time + LastScore:
            LastScore = control.millis()
            CalcScore()
    elif _function == "Age":
        if runningTime > time + LastAge:
            LastAge = control.millis()
            Age += 1
            music._play_default_background(music.built_in_playable_melody(Melodies.BA_DING),
                music.PlaybackMode.IN_BACKGROUND)
    elif _function == "Jump":
        if runningTime > time + LastJump:
            LastJump = control.millis()
            Jump()
def Death():
    # Instead of a normal death value, this function checks every stat needed for survival
    if PoopCount >= 3 or (Hunger <= 0 or Energy <= 0 or Thirst <= 0 or Hapiness <= 0 or Age >= LifeExpecteny):
        music.stop_melody(MelodyStopOptions.ALL)
        basic.clear_screen()
        music._play_default_background(music.built_in_playable_melody(Melodies.WAWAWAWAA),
            music.PlaybackMode.UNTIL_DONE)
        basic.show_icon(IconNames.SKULL)
        music._play_default_background(music.built_in_playable_melody(Melodies.FUNK),
            music.PlaybackMode.LOOPING_IN_BACKGROUND)
        game.game_over()
def Eat():
    global FoodCount, Hunger, Thirst
    if FoodCount >= 1:
        led.unplot(4, TopFood)
        FoodCount += -1
        Hunger += 15
        Thirst += 5
        # If still hungery, and there is food, it will eat it all
        if Hunger < 100 and FoodCount >= 1:
            Eat()
def Poop():
    global PoopCount
    led.plot(0, 4 - PoopCount)
    PoopCount += 1
def CalcStats():
    global Thirst, Hapiness, Energy, Hunger
    CalcStatRates()
    if TopBarMode:
        Thirst += 0 - ThirstRate
        Hapiness += 0 - HappinessRate
    Energy += 0 - EnergyRate
    Hunger += 0 - HungerRate
def CleanPoop():
    global PoopCount
    if PersonalityUseCalc(35, 0.05) > Aggression and PoopCount >= 1:
        PoopCount += -1
        led.unplot(0, 4 - PoopCount)
Elapsed = 0
FrameStart = 0
LastJump = 0
LastAge = 0
LastScore = 0
LastBarFlash = 0
LastTBM = 0
LastFed = 0
LastStats = 0
LastCleanPoop = 0
LastPoop = 0
runningTime = 0
total = 0
PetOldY = 0
PetOldX = 0
PlayerLuck = 0
LifeExpecteny = 0
PetX = 0
PetY = 0
TopFood = 0
TopBarMode = False
EnergyRate = 0
ThirstRate = 0
HungerRate = 0
HappinessRate = 0
PoopTimer = 0
FoodCount = 0
PoopCount = 0
Age = 0
Intelligence = 0
Playfulness = 0
Aggression = 0
Thirst = 0
Energy = 0
Hunger = 0
Hapiness = 0
basic.show_icon(IconNames.SMALL_DIAMOND)
music.set_volume(32)
music._play_default_background(music.built_in_playable_melody(Melodies.ENTERTAINER),
    music.PlaybackMode.IN_BACKGROUND)
FrameInterval = 50
Hapiness = 100
Hunger = 100
Energy = 100
Thirst = 100
Aggression = CurveGenerator(1, 100)
Curiosity = CurveGenerator(1, 100)
Playfulness = CurveGenerator(1, 100)
Intelligence = CurveGenerator(1, 100)
Obedience = CurveGenerator(1, 100)
Age = 0
PoopCount = 0
FoodCount = 0
PoopTimer = CurveGenerator(5000, 30000)
HappinessRate = 1
HungerRate = 1
ThirstRate = 1
EnergyRate = 1
TopBarMode = False
TopPoop2 = 4
TopFood = 4
PetY = 3
PetX = 1
LifeExpecteny = CurveGenerator(10, 30)
PlayerLuck = CurveGenerator(0, 100)
timerrr = control.millis()
game.set_score(0)
basic.show_icon(IconNames.DIAMOND)
basic.show_icon(IconNames.SQUARE)
basic.clear_screen()
music._play_default_background(music.built_in_playable_melody(Melodies.NYAN),
    music.PlaybackMode.LOOPING_IN_BACKGROUND)

def on_forever():
    global timerrr, FrameStart, Elapsed
    datalogger.log(datalogger.create_cv("Time", control.millis() - timerrr))
    timerrr = control.millis()
    FrameStart = control.millis()
    Timer(PoopTimer, "Poop")
    Timer(2000, "CalcStats")
    # Soon: BarMode
    if TopBarMode:
        Timer(1000, "BarFlash")
        if input.button_is_pressed(Button.AB):
            Timer(500, "TopBarMode")
    elif input.button_is_pressed(Button.AB):
        Timer(500, "TopBarMode")
    elif input.button_is_pressed(Button.A):
        Timer(500, "Feed")
    elif input.button_is_pressed(Button.B):
        if Energy < 50:
            Sleep()
        else:
            Timer(500, "CleanPoop")
    elif input.is_gesture(Gesture.SHAKE):
        Jump()
    if Hunger < 75 + Curiosity / 10:
        Eat()
    Timer(5000, "Score")
    Timer(20000, "Age")
    capStats()
    Death()
    PlotPet()
    Elapsed = control.millis() - FrameStart
    if Elapsed < FrameInterval:
        basic.pause(FrameInterval - Elapsed)
basic.forever(on_forever)
