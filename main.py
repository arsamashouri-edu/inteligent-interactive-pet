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
def Timer(time: number, _function: str):
    global runningTime, LastPoop, LastCleanPoop, LastStats
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
LastStats = 0
LastCleanPoop = 0
LastPoop = 0
runningTime = 0
total = 0
TopPoop = 0
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

def on_forever():
    Timer(3000, "Poop")
    Timer(2000, "CalcStats")
    if TopBarMode:
        pass
    else:
        if input.button_is_pressed(Button.B):
            Timer(500, "CleanPoop")
basic.forever(on_forever)
