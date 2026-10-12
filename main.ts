function CurveGenerator (minimum: number, maximum: number) {
    total = 0
    for (let index = 0; index < 5; index++) {
        total += randint(minimum, maximum / 5)
    }
    return total
}
function CalcStatRates () {
    HungerRate = Math.max(1 - Happiness / 200 + Age / 100 + Energy / 75, 0.75)
    ThirstRate = Math.max(1 + Age / 100 + Energy / 75, 0.75)
    EnergyRate = Math.max(1 + Happiness / 75 + Age / 100 - Hunger / 75, 0.75)
    HappinessRate = Math.max(1 + Hunger / 75 + Age / 100 + Energy / 200, 0.75)
}
function Feed () {
    led.plot(4, TopFood)
    TopFood += -1
}
function Timer (time: number, _function: string) {
    runningTime = control.millis()
    if (_function == "Poop") {
        if (runningTime > time + LastPoop) {
            LastPoop = control.millis()
            Poop()
        }
    } else if (_function == "CleanPoop") {
        if (runningTime > time + LastCleanPoop) {
            LastCleanPoop = control.millis()
            CleanPoop()
        }
    } else if (_function == "CalcStats") {
        if (runningTime > time + LastStats) {
            LastStats = control.millis()
            CalcStats()
        }
    } else if (_function == "Feed") {
        if (runningTime > time + LastFed) {
            LastFed = control.millis()
        }
    } else if (_function == "TopBarMode") {
        if (runningTime > time + LastTBM) {
            LastTBM = control.millis()
            TopBarMode = !(TopBarMode)
        }
    } else if (_function == "BarFlash") {
        if (runningTime > time + LastBarFlash) {
            LastBarFlash = control.millis()
        }
    } else if (_function == "Score") {
        if (runningTime > time + LastScore) {
            LastScore = control.millis()
        }
    }
}
function Eat () {
    // ADD if hungry and lots of food eat all
    TopFood += 1
    led.unplot(0, TopFood)
    Hunger += 15
}
function Poop () {
    led.plot(0, TopPoop)
    TopPoop += -1
}
function CalcStats () {
    CalcStatRates()
    Energy += 0 - EnergyRate
    Hunger += 0 - HungerRate
    Thirst += 0 - ThirstRate
    Happiness += 0 - HappinessRate
}
function CleanPoop () {
    TopPoop = Math.min(TopPoop + 1, 4)
    led.unplot(0, TopPoop)
}
let LastScore = 0
let LastBarFlash = 0
let LastTBM = 0
let LastFed = 0
let LastStats = 0
let LastCleanPoop = 0
let LastPoop = 0
let runningTime = 0
let total = 0
let TopFood = 0
let TopPoop = 0
let TopBarMode = false
let EnergyRate = 0
let ThirstRate = 0
let HungerRate = 0
let HappinessRate = 0
let Age = 0
let Energy = 0
let Hunger = 0
let Happiness = 0
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
game.setScore(0)
Happiness = 100
Hunger = 100
Energy = 100
let Thirst = 100
let Aggression = CurveGenerator(1, 100)
let Curiosity = CurveGenerator(1, 100)
let Playfulness = CurveGenerator(1, 100)
let Intelligence = CurveGenerator(1, 100)
let Obedience = CurveGenerator(1, 100)
Age = 0
HappinessRate = 1
HungerRate = 1
ThirstRate = 1
EnergyRate = 1
TopBarMode = false
TopPoop = 4
TopFood = 4
basic.forever(function () {
    Timer(3000, "Poop")
    Timer(2000, "CalcStats")
    if (TopBarMode) {
        Timer(500, "BarFlash")
    } else if (input.buttonIsPressed(Button.AB)) {
        Timer(500, "TopBarMode")
    } else if (input.buttonIsPressed(Button.A)) {
        Timer(500, "Feed")
    } else if (input.buttonIsPressed(Button.B)) {
        Timer(500, "CleanPoop")
    }
    if (Hunger < 75) {
        Eat()
    }
    Timer(5000, "Score")
})
