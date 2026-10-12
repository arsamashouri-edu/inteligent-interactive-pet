function CalcScore () {
    game.setScore(0)
}
function CurveGenerator (minimum: number, maximum: number) {
    total = 0
    for (let index = 0; index < 5; index++) {
        total += randint(minimum, maximum / 5)
    }
    return total
}
function CalcStatRates () {
    HungerRate = Math.max(1 - Happiness2 / 200 + Age / 100 + Energy2 / 75, 0.75)
    ThirstRate = Math.max(1 + Age / 100 + Energy2 / 75, 0.75)
    EnergyRate = Math.max(1 + Happiness2 / 75 + Age / 100 - Hunger2 / 75, 0.75)
    HappinessRate = Math.max(1 + Hunger2 / 75 + Age / 100 + Energy2 / 200, 0.75)
}
function Feed () {
    led.plot(4, TopFood)
    TopFood += -1
}
function Jump () {
	
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
            Feed()
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
            CalcStats()
        }
    } else if (_function == "Age") {
        if (runningTime > time + LastAge) {
            LastAge = control.millis()
            Age += 1
        }
    }
}
function Death (TopPoop: number, Hunger: number, Thirst: number, Energy: number, Happiness: number) {
    if (TopPoop == 2 || (Hunger <= 0 || (Hunger <= 0 || (Hunger <= 0 || (Hunger <= 0 || Hunger <= 0))))) {
        basic.clearScreen()
        basic.showIcon(IconNames.Skull)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.UntilDone)
        basic.showString("" + (game.score()))
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Dadadadum), music.PlaybackMode.InBackground)
        game.gameOver()
    }
}
function Eat () {
    // ADD if hungry and lots of food eat all
    TopFood += 1
    led.unplot(4, TopFood)
    Hunger2 += 15
}
function Draw (Screen: any[]) {
	
}
function Poop () {
    led.plot(0, TopPoop2)
    TopPoop2 += -1
}
function CalcStats () {
    CalcStatRates()
    Energy2 += 0 - EnergyRate
    Hunger2 += 0 - HungerRate
    Thirst2 += 0 - ThirstRate
    Happiness2 += 0 - HappinessRate
}
function CleanPoop () {
    TopPoop2 = Math.min(TopPoop2 + 1, 4)
    led.unplot(0, TopPoop2)
}
let LastAge = 0
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
let TopPoop2 = 0
let TopBarMode = false
let EnergyRate = 0
let ThirstRate = 0
let HungerRate = 0
let HappinessRate = 0
let Age = 0
let Energy2 = 0
let Hunger2 = 0
let Happiness2 = 0
basic.showIcon(IconNames.SmallDiamond)
music.setVolume(127)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
game.setScore(0)
Happiness2 = 100
Hunger2 = 100
Energy2 = 100
let Thirst2 = 100
basic.showIcon(IconNames.Diamond)
let Aggression = CurveGenerator(1, 100)
let Curiosity = CurveGenerator(1, 100)
let Playfulness = CurveGenerator(1, 100)
let Intelligence = CurveGenerator(1, 100)
let Obedience = CurveGenerator(1, 100)
Age = 0
basic.showIcon(IconNames.Square)
HappinessRate = 1
HungerRate = 1
ThirstRate = 1
EnergyRate = 1
TopBarMode = false
TopPoop2 = 4
TopFood = 4
basic.clearScreen()
basic.forever(function () {
    Timer(CurveGenerator(2000, 5000), "Poop")
    Timer(2000, "CalcStats")
    if (TopBarMode) {
        Timer(1000, "BarFlash")
    } else if (input.buttonIsPressed(Button.AB)) {
        Timer(500, "TopBarMode")
    } else if (input.buttonIsPressed(Button.A)) {
        Timer(500, "Feed")
    } else if (input.buttonIsPressed(Button.B)) {
        Timer(500, "CleanPoop")
    } else if (input.isGesture(Gesture.FreeFall)) {
        Jump()
    }
    if (Hunger2 < 75) {
        Eat()
    }
    Timer(5000, "Score")
    Timer(60000, "Age")
    Death(TopPoop2, Hunger2, Thirst2, Energy2, Happiness2)
})
