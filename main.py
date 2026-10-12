def CurveGenerator(minimum: number, maximum: number):
    global total
    total = 0
    for index in range(5):
        total += randint(minimum, maximum / 5)
    return total
def CalcStatRates():
    global HungerRate, ThirstRate, EnergyRate, HappinessRate
    HungerRate = max(1 - Happiness / 200 + Age / 100 + Energy / 75, 0.75)
    ThirstRate = max(1 + Age / 100 + Energy / 75, 0.75)
    EnergyRate = max(1 + Happiness / 75 + Age / 100 - Hunger / 75, 0.75)
    HappinessRate = max(1 + Hunger / 75 + Age / 100 + Energy / 200, 0.75)
def Feed():
    global TopFood
    led.plot(4, TopFood)
    TopFood += -1
def Timer(time: number, _function: str):
    global runningTime, LastPoop, LastCleanPoop, LastStats, LastFed, LastTBM, TopBarMode, LastBarFlash, LastScore
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
def Eat(): # ADD if hungry and lots of food eat all
    global TopFood, Hunger
    TopFood += 1
    led.unplot(0, TopFood)
    Hunger += 15
def Poop():
    global TopPoop
    led.plot(0, TopPoop)
    TopPoop += -1
def CalcStats():
    global Energy, Hunger, Thirst, Happiness
    CalcStatRates()
    Energy += 0 - EnergyRate
    Hunger += 0 - HungerRate
    Thirst += 0 - ThirstRate
    Happiness += 0 - HappinessRate
def CleanPoop():
    global TopPoop
    TopPoop = min(TopPoop + 1, 4)
    led.unplot(0, TopPoop)
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
TopPoop = 0
TopBarMode = False
EnergyRate = 0
ThirstRate = 0
HungerRate = 0
HappinessRate = 0
Age = 0
Energy = 0
Hunger = 0
Happiness = 0
music._play_default_background(music.built_in_playable_melody(Melodies.ENTERTAINER),
    music.PlaybackMode.IN_BACKGROUND)
game.set_score(0)
Happiness = 100
Hunger = 100
Energy = 100
Thirst = 100
Aggression = CurveGenerator(1, 100)
Curiosity = CurveGenerator(1, 100)
Playfulness = CurveGenerator(1, 100)
Intelligence = CurveGenerator(1, 100)
Obedience = CurveGenerator(1, 100)
Age = 0
HappinessRate = 1
HungerRate = 1
ThirstRate = 1
EnergyRate = 1
TopBarMode = False
TopPoop = 4
TopFood = 4

def on_forever():
    Timer(3000, "Poop")
    Timer(2000, "CalcStats")
    if TopBarMode:
        Timer(500, "BarFlash")
    else:
        if input.button_is_pressed(Button.AB):
            Timer(500, "TopBarMode")
        elif input.button_is_pressed(Button.A):
            Timer(500, "Feed")
        elif input.button_is_pressed(Button.B):
            Timer(500, "CleanPoop")
    if Hunger < 75:
        Eat()
    Timer(5000, "Score")
basic.forever(on_forever)
