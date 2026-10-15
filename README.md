# Interactive Micro:bit Pet

A virtual pet built with Microsoft MakeCode Python for the BBC
micro:bit. The project uses the micro:bit's 5×5 LED display, physical
inputs, timers, randomized personality traits, and an optional external
controller.

## Features

-   **Pet statistics:** Hunger, energy, and happiness change during
    gameplay.
-   **Pet actions:** Feed, eat, sleep, jump, and clean up poop.
-   **Randomized personality:** Traits such as curiosity, playfulness,
    obedience, aggression, and intelligence are generated for each pet.
-   **Pet care and game over:** The pet can die when certain conditions
    are reached, including depleted statistics, too much poop, or
    reaching its life-expectancy limit.
-   **LED display:** The pet and simple objects are represented on the
    5×5 display.
-   **Controller support:** The project uses the `myController`
    extension for external controller input.
-   **Timed game loop:** The main loop is designed around a 50 ms
    interval (20 updates per second).

## Controls

Controls depend on whether the external controller is connected.

  -----------------------------------------------------------------------
  Input                               Action
  ----------------------------------- -----------------------------------
  Micro:bit button A                  Triggers the programmed feeding
                                      action

  Micro:bit button B                  Sleeps when energy is below the
                                      configured threshold; otherwise
                                      cleans poop

  Logo touch                          Jump

  External controller button 1        Sleep when energy is below the
                                      configured threshold; otherwise
                                      clean poop

  External controller button 3        Jump

  External controller button 4        Add food
  -----------------------------------------------------------------------

**Note:** In the current implementation, adding food to the inventory
and consuming food are separate behaviours. Check the code's current
mappings if you change the controls.

## Requirements

-   BBC micro:bit compatible with the APIs used by the project
-   Microsoft MakeCode for micro:bit
-   The `myController` extension used by the source code
-   A compatible browser and Bluetooth setup if using the external
    controller

Bluetooth support can depend on the micro:bit model, browser, extension,
and connection setup. External controller connectivity has been an issue
during development.

## Running the Project

1.  Open the project in Microsoft MakeCode for micro:bit.
2.  Ensure the `myController` extension is available and included.
3.  Compile the project and download the resulting program to the
    micro:bit.
4.  Reset the device and test the physical controls.
5.  If using the external controller, open the compatible controller
    website and connect the micro:bit using its connection workflow.

The exact setup may vary with the micro:bit model and the controller
website.

## Known Issues and Development Notes

-   **Jump lag:** A delay has been observed during jumping.
-   **Accuracy bug:** A behaviour or calculation accuracy issue has been
    identified and needs further debugging.
-   **Bluetooth connectivity:** The external controller has not
    connected reliably.
-   **Timing:** The game loop was changed to target a consistent 50 ms
    interval. Actual timing should still be measured during gameplay,
    especially when display or music operations are running.
-   **Thirst:** A thirst statistic is not implemented in the current
    version.
-   **Random events:** A general random-event system is not implemented
    yet.
-   **Personality effects:** Some generated traits may not yet have a
    meaningful effect on gameplay.

These notes describe known development issues, not confirmed fixes.

## Project Goals

The project explores how an embedded device can simulate a small
interactive system using:

-   Variables and state management
-   Functions and event-driven input
-   Random number generation
-   Timers and periodic updates
-   Conditional logic and game-over checks
-   Hardware input and LED output

## Future Improvements

1.  Reduce jump-animation latency and improve responsiveness.
2.  Debug the accuracy issue, then add thirst and personality-driven
    random events.
3.  Improve Bluetooth setup and reconnection reliability.

## License

This project goes under BSL-1.0 licence
