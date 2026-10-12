def CalcScore():
    game.set_score(0)
def CurveGenerator(minimum: number, maximum: number):
    global total
    total = 0
    for index in range(5):
        total += randint(minimum, maximum / 5)
    return total
def Die(TopPoop: number, Hunger: number, Thirst: number, Energy: number, Happiness: number):
    pass
def CalcStatRates():
    global HungerRate, ThirstRate, EnergyRate, HappinessRate
    HungerRate = max(1 - Happiness2 / 200 + Age / 100 + Energy2 / 75, 0.75)
    ThirstRate = max(1 + Age / 100 + Energy2 / 75, 0.75)
    EnergyRate = max(1 + Happiness2 / 75 + Age / 100 - Hunger2 / 75, 0.75)
    HappinessRate = max(1 + Hunger2 / 75 + Age / 100 + Energy2 / 200, 0.75)
def Feed():
    global TopFood
    led.plot(4, TopFood)
    TopFood += -1
def Jump():
    pass
def Timer(time: number, _function: str):
    global runningTime, LastPoop, LastCleanPoop, LastStats, LastFed, LastTBM, TopBarMode, LastBarFlash, LastScore, LastAge, Age
    runningTime = control.millis()
    if _function == "Poop":
        if runningTime > time + LastPoop:
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
            CalcStats()
    elif _function == "Age":
        if runningTime > time + LastAge:
            LastAge = control.millis()
            Age += 1
def Eat():
    global TopFood, Hunger2
    # ADD if hungry and lots of food eat all
    TopFood += 1
    led.unplot(4, TopFood)
    Hunger2 += 15
def Draw(Screen: List[any]):
    pass
def Poop():
    global TopPoop2
    led.plot(0, TopPoop2)
    TopPoop2 += -1
def CalcStats():
    global Energy2, Hunger2, Thirst2, Happiness2
    CalcStatRates()
    Energy2 += 0 - EnergyRate
    Hunger2 += 0 - HungerRate
    Thirst2 += 0 - ThirstRate
    Happiness2 += 0 - HappinessRate
def CleanPoop():
    global TopPoop2
    TopPoop2 = min(TopPoop2 + 1, 4)
    led.unplot(0, TopPoop2)
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
TopFood = 0
TopPoop2 = 0
TopBarMode = False
EnergyRate = 0
ThirstRate = 0
HungerRate = 0
HappinessRate = 0
Age = 0
Energy2 = 0
Hunger2 = 0
Happiness2 = 0
basic.show_icon(IconNames.SMALL_DIAMOND)
music.set_volume(32)
music._play_default_background(music.built_in_playable_melody(Melodies.ENTERTAINER),
    music.PlaybackMode.IN_BACKGROUND)
game.set_score(0)
Happiness2 = 100
Hunger2 = 100
Energy2 = 100
Thirst2 = 100
basic.show_icon(IconNames.DIAMOND)
Aggression = CurveGenerator(1, 100)
Curiosity = CurveGenerator(1, 100)
Playfulness = CurveGenerator(1, 100)
Intelligence = CurveGenerator(1, 100)
Obedience = CurveGenerator(1, 100)
Age = 0
basic.show_icon(IconNames.SQUARE)
HappinessRate = 1
HungerRate = 1
ThirstRate = 1
EnergyRate = 1
TopBarMode = False
TopPoop2 = 4
TopFood = 4
basic.clear_screen()

def on_forever():
    Timer(CurveGenerator(2000, 5000), "Poop")
    Timer(2000, "CalcStats")
    if TopBarMode:
        Timer(1000, "BarFlash")
    elif input.button_is_pressed(Button.AB):
        Timer(500, "TopBarMode")
    elif input.button_is_pressed(Button.A):
        Timer(500, "Feed")
    elif input.button_is_pressed(Button.B):
        Timer(500, "CleanPoop")
    elif input.is_gesture(Gesture.FREE_FALL):
        Jump()
    if Hunger2 < 75:
        Eat()
    Timer(5000, "Score")
    Timer(60000, "Age")
basic.forever(on_forever)
