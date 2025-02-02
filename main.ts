function berechneALR () {
    xZiel = huskylens.readeArrow(1, Content2.xTarget)
    xStart = huskylens.readeArrow(1, Content2.xOrigin)
    serial.writeValue("Ziel", xZiel)
    serial.writeValue("start", xStart)
    deltaX = xZiel - xStart
    deltaY = huskylens.readeArrow(1, Content2.yTarget) - huskylens.readeArrow(1, Content2.yOrigin)
    if (Math.abs(deltaX) < 0.001) {
        abweichung = 0
    } else {
        if (Math.abs(deltaY) < 0.001) {
            deltaY = 0.001
        }
        abweichung = 10 * Math.abs(deltaX) / Math.abs(deltaY)
    }
    laenge = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (deltaX < 0) {
        richtung = -1
    } else {
        richtung = 1
    }
}
function zeigeWeitLinks () {
    basic.showLeds(`
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        `)
}
function zurueckVonRechts () {
    zeigeWeitLinks()
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(50)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 10)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
    basic.pause(250)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, tempo)
    basic.pause(50)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(50)
}
function rechtsLenken () {
    if (laenge < 60) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        basic.pause(200)
    } else {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
        if (abweichung > 0.5) {
            if (abweichung < 1.8) {
                basic.showIcon(IconNames.ArrowWest)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 5)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
                basic.pause(150)
            } else {
                basic.showIcon(IconNames.ArrowNorthWest)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 15)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
                basic.pause(200)
            }
        } else {
            basic.showIcon(IconNames.ArrowSouth)
            maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, tempo)
            basic.pause(200)
        }
    }
}
function linksLenken () {
    if (laenge < 60) {
        serial.writeValue("GANZLINKS", abweichung)
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 0)
    } else {
        if (abweichung > 0.5) {
            if (abweichung < 1.8) {
                maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
                basic.showIcon(IconNames.ArrowEast)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 5)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
                basic.pause(150)
            } else {
                basic.showIcon(IconNames.ArrowNorthEast)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 15)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
                basic.pause(200)
            }
        } else {
            basic.showIcon(IconNames.ArrowSouth)
            maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, tempo)
            basic.pause(200)
        }
    }
}
function zeigeWeitRechts () {
    basic.showLeds(`
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        `)
}
function zurueckVonLinks () {
    zeigeWeitRechts()
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(50)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 10)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
    basic.pause(250)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, tempo)
    basic.pause(50)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(50)
}
let richtung = 0
let laenge = 0
let abweichung = 0
let deltaX = 0
let deltaY = 0
let xZiel = 0
let xStart = 0
let tempo = 0
tempo = 30
xStart = 0
xZiel = 0
deltaY = 0
deltaY = 0
maqueen.writeLED(maqueen.Led.LedAll, maqueen.LedSwitch.LedOn)
basic.showIcon(IconNames.Heart, 600)
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_LINE_TRACKING)
huskylens.writeName(1, "orange")
basic.showIcon(IconNames.Yes)
basic.forever(function () {
    huskylens.request()
    if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultArrow)) {
        berechneALR()
        if (Math.abs((xZiel + xStart) / 2) < 120 || Math.abs((xZiel + xStart) / 2) > 180) {
            if (Math.abs((xZiel + xStart) / 2) < 120) {
                serial.writeValue("zu weit von Mitte", Math.abs((xZiel - xStart) / 2))
                zurueckVonRechts()
            } else if (Math.abs((xZiel + xStart) / 2) > 180) {
                zurueckVonLinks()
            }
        } else {
            if (richtung < 0) {
                linksLenken()
            } else {
                rechtsLenken()
            }
        }
    } else {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
        basic.showIcon(IconNames.Square)
    }
})
