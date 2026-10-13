function Cap(value: number, minimum: number, maximum: number): number {
    return Math.max(minimum, Math.min(maximum, value))
}

function PlotPet() {
    let y: number;
    
    let x = PetOldX
    while (x < PetOldX + 2) {
        y = PetOldY
        while (y < PetOldY + 2) {
            led.unplot(Cap(x, 0, 4), Cap(y, 0, 4))
            y += 1
        }
        x += 1
    }
    x = PetX
    while (x < PetX + 2) {
        y = PetY2
        while (y < PetY2 + 2) {
            led.plot(Cap(x, 0, 4), Cap(y, 0, 4))
            y += 1
        }
        x += 1
    }
    PetOldY = PetY2
    PetOldX = PetX
}

function PersonalityUseCalc(curve: number, luckModifier: number): number {
    return CurveGenerator(curve + randint(0, luckModifier * PlayerLuck), 100)
}

function CalcScore() {
    game.setScore(game.score() + (Age * 10 + Hapiness / 10))
}

function CurveGenerator(minimum2: number, maximum2: number): number {
    
    //  This function acts as a simple replacement for the bell curve since The
    //  bell curve takes too much computational work, and gives near same results.
    total = 0
    for (let index = 0; index < 5; index++) {
        total += randint(minimum2 / 5, maximum2 / 5)
    }
    return total
}

function CalcStatRates() {
    
    HungerRate = Cap(1 - Hapiness / 200 + Age / 100 + Energy / 75 - Intelligence / 100, 0.75, 3)
    EnergyRate = Cap(1 + Hapiness / 75 + Age / 100 - Hunger / 75 + Intelligence / 100, 0.75, 3)
    HappinessRate = Cap(1 + Hunger / 75 + Age / 100 - Energy / 200 - Intelligence / 100, 0.75, 3)
}

function Feed() {
    
    led.plot(4, 4 - FoodCount)
    FoodCount = Cap(FoodCount + 1, 0, 4)
}

function Sleep() {
    let Energy: any;
    
    PetY2 = 4
    PlotPet()
    SleepTime = control.millis()
    SleepStage = 0
    Sleeping = true
    for (let i = 0; i < 10; i++) {
        basic.pause(500)
        Energy = Energy + 4.5
    }
}

//  This creates a sence of sleeping because the pet looks shorter on screen
function Jump() {
    
    if (PersonalityUseCalc(20, 0.05) < Playfulness && Energy > 70) {
        PetY2 = 2
        PlotPet()
        Jumping = true
        JumpStart = control.millis()
        Energy += -15
        Hunger += -15
        Hapiness += 25
    }
    
}

function capStats() {
    
    Hapiness = Cap(Hapiness, 0, 100)
    Energy = Cap(Energy, 0, 100)
    Hunger = Cap(Hunger, 0, 100)
}

//  The game runs only on 1 clock, this function uses
//  only 1 clock to check for several events that happen
//  throughout the game
function Timer(time: number, _function: string) {
    let Enegry: any;
    
    runningTime = control.millis()
    if (_function == "Poop") {
        if (runningTime > time + LastPoop) {
            PoopTimer = CurveGenerator(5000, 30000)
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
        
    } else if (_function == "Score") {
        if (runningTime > time + LastScore) {
            LastScore = control.millis()
            CalcScore()
        }
        
    } else if (_function == "Age") {
        if (runningTime > time + LastAge) {
            LastAge = control.millis()
            Age += 1
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.UntilDone)
        }
        
    } else if (_function == "Jump") {
        if (runningTime > time + LastJump) {
            LastJump = control.millis()
            Jump()
        }
        
    } else if (_function == "JumpDown") {
        if (runningTime > time + JumpStart) {
            PetY2 = 3
            PlotPet()
            Jumping = false
        }
        
    } else if (_function == "Wakeup") {
        if (runningTime > time + SleepTime) {
            SleepTime = control.millis()
            SleepStage = SleepStage + 1
            Enegry = Energy + 4.5
            if (SleepStage == 10) {
                Sleeping = false
                PetY2 = 3
                PlotPet()
            }
            
        }
        
    }
    
}

function Death() {
    //  Instead of a normal death value, this function checks every stat needed for survival
    if (PoopCount >= 3 || (Hunger <= 0 || Energy <= 0 || Hapiness <= 0 || Age >= LifeExpecteny)) {
        music.stopMelody(MelodyStopOptions.All)
        basic.clearScreen()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Skull)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.LoopingInBackground)
        game.gameOver()
    }
    
}

function Eat() {
    
    if (FoodCount >= 1) {
        led.unplot(4, 4 - FoodCount)
        FoodCount += -1
        Hunger += 15
        //  If still hungery, and there is food, it will eat it all
        if (Hunger < 100 && FoodCount >= 1) {
            Eat()
        }
        
    }
    
}

function Poop() {
    
    led.plot(0, 4 - PoopCount)
    PoopCount = Cap(PoopCount + 1, 0, 4)
}

function CalcStats() {
    
    CalcStatRates()
    Hapiness += 0 - HappinessRate
    Energy += 0 - EnergyRate
    Hunger += 0 - HungerRate
}

function CleanPoop() {
    
    if (PersonalityUseCalc(35, 0.05) > Aggression && PoopCount >= 1) {
        PoopCount += -1
        led.unplot(0, 4 - PoopCount)
    }
    
}

let FrameStart = 0
let Elapsed = 0
let PoopCount = 0
let LastJump = 0
let LastAge = 0
let LastScore = 0
let SleepTime = 0
let SleepStage = 0
let Sleeping = false
let LastFed = 0
let LastStats = 0
let LastCleanPoop = 0
let LastPoop = 0
let runningTime = 0
let JumpStart = 0
let Jumping = false
let FoodCount = 0
let total = 0
let Age = 0
let PetOldY = 0
let PetOldX = 0
let PlayerLuck = 0
let LifeExpecteny = 0
let PetX = 0
let PetY2 = 0
let EnergyRate = 0
let HungerRate = 0
let HappinessRate = 0
let PoopTimer = 0
let Intelligence = 0
let Playfulness = 0
let Aggression = 0
let Energy = 0
let Hunger = 0
let Hapiness = 0
basic.showIcon(IconNames.SmallDiamond)
music.setVolume(32)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
let FrameInterval = 50
Hapiness = 100
Hunger = 100
Energy = 100
Aggression = CurveGenerator(40, 100)
let Curiosity = CurveGenerator(40, 100)
Playfulness = CurveGenerator(40, 100)
Intelligence = CurveGenerator(40, 100)
let Obedience = CurveGenerator(40, 100)
PoopTimer = CurveGenerator(5000, 30000)
HappinessRate = 1
HungerRate = 1
EnergyRate = 1
PetY2 = 3
PetX = 1
LifeExpecteny = CurveGenerator(10, 30)
PlayerLuck = CurveGenerator(0, 100)
let timerrr = control.millis()
game.setScore(0)
basic.showIcon(IconNames.Diamond)
basic.showIcon(IconNames.Square)
basic.clearScreen()
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Nyan), music.PlaybackMode.LoopingInBackground)
Feed()
Feed()
PlotPet()
basic.forever(function on_forever() {
    
    Timer(PoopTimer, "Poop")
    Timer(2000, "CalcStats")
    if (Jumping) {
        Timer(500, "JumpDown")
    } else if (Sleeping) {
        Timer(500, "Wakeup")
    } else if (input.buttonIsPressed(Button.A)) {
        Timer(500, "Feed")
    } else if (input.buttonIsPressed(Button.B)) {
        if (Energy < 50) {
            Sleep()
        } else {
            Timer(500, "CleanPoop")
        }
        
    } else if (input.logoIsPressed()) {
        Jump()
    }
    
    if (Hunger < 75 + Curiosity / 10) {
        Eat()
    }
    
    Timer(5000, "Score")
    Timer(20000, "Age")
    capStats()
    Death()
    Elapsed = control.millis() - FrameStart
    if (Elapsed < FrameInterval) {
        basic.pause(FrameInterval - Elapsed)
    }
    
    //  FrameStart is calculated at the end of the frame
    //  This is done because the microbit does other functions
    //  Between the forever loops
    FrameStart = control.millis()
})
