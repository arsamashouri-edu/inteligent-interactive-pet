function PlotPet () {
    led.plot(PetX, PetY)
    led.plot(PetX, PetY + 1)
    led.plot(PetX + 1, PetY)
    led.plot(PetX + 1, PetY + 1)
}
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
    HungerRate = Math.max(1 - Hapiness / 200 + Age / 100 + Energy / 75, 0.75)
    ThirstRate = Math.max(1 + Age / 100 + Energy / 75, 0.75)
    EnergyRate = Math.max(1 + Hapiness / 75 + Age / 100 - Hunger / 75, 0.75)
    HappinessRate = Math.max(1 + Hunger / 75 + Age / 100 + Energy / 200, 0.75)
}
function Feed () {
    led.plot(4, TopFood)
    TopFood += -1
}
function Jump () {
    PetY = 2
    PlotPet()
    led.unplot(1, 4)
    led.unplot(2, 4)
    basic.pause(500)
    PetY = 3
    PlotPet()
    led.unplot(1, 2)
    led.unplot(2, 2)
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
    } else if (_function == "Jump") {
        if (runningTime > time + LastJump) {
            LastJump = control.millis()
            PetY = 2
        }
    }
}
function Death (TopPoop: number, Hunger: number, Thirst: number, Energy: number, Happiness: number) {
    if (TopPoop == 0 || (Hunger <= 0 || (Hunger <= 0 || (Hunger <= 0 || (Hunger <= 0 || Hunger <= 0))))) {
        music.stopMelody(MelodyStopOptions.All)
        basic.clearScreen()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Skull)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.LoopingInBackground)
        game.gameOver()
    }
}
function Eat () {
    // ADD if hungry and lots of food eat all
    TopFood = TopFood + 1
    if (TopFood < 5) {
        led.unplot(4, TopFood)
        Hunger += 15
        Thirst += 5
    }
}
function Poop () {
    led.plot(0, TopPoop2)
    TopPoop2 += -1
}
function CalcStats () {
    CalcStatRates()
    Energy += 0 - EnergyRate
    Hunger += 0 - HungerRate
    Thirst += 0 - ThirstRate
    Hapiness += 0 - HappinessRate
}
function CleanPoop () {
    TopPoop2 = Math.min(TopPoop2 + 1, 4)
    led.unplot(0, TopPoop2)
}
let LastJump = 0
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
let PetX = 0
let PetY = 0
let TopFood = 0
let TopPoop2 = 0
let TopBarMode = false
let EnergyRate = 0
let ThirstRate = 0
let HungerRate = 0
let HappinessRate = 0
let Age = 0
let Energy = 0
let Hunger = 0
let Hapiness = 0
basic.showIcon(IconNames.SmallDiamond)
music.setVolume(32)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
game.setScore(0)
Hapiness = 100
Hunger = 100
Energy = 100
let Thirst = 100
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
PetY = 3
PetX = 1
basic.clearScreen()
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Nyan), music.PlaybackMode.LoopingInBackground)
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
    } else if (input.isGesture(Gesture.Shake)) {
        Jump()
    }
    if (Hunger < 75) {
        Eat()
    }
    Timer(5000, "Score")
    Timer(60000, "Age")
    Death(TopPoop2, Hunger, Thirst, Energy, Hapiness)
    PlotPet()
})
