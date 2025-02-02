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
    serial.writeValue("Richtung", richtung)
    serial.writeValue("abweichung", abweichung)
    serial.writeValue("Richtung", richtung)
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
    serial.writeValue("zu weit rechts", 1)
    zeigeWeitLinks()
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(100)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
    basic.pause(200)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, tempo)
    basic.pause(80)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(5)
}
function rechtsLenken () {
    if (laenge < 60) {
        serial.writeValue("GANZRECHTS", abweichung)
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
        basic.pause(200)
    } else {
        if (abweichung > 0.5) {
            if (abweichung < 1) {
                basic.showIcon(IconNames.ArrowWest)
                serial.writeValue("rechtsLenken", abweichung)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
                basic.pause(150)
            } else {
                basic.showIcon(IconNames.ArrowNorthWest)
                serial.writeValue("starkrechtsLenken", abweichung)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 0)
                basic.pause(100)
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
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
        basic.pause(200)
    } else {
        if (abweichung > 0.5) {
            if (abweichung < 1) {
                basic.showIcon(IconNames.ArrowEast)
                serial.writeValue("linkLenken", abweichung)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
                maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
                basic.pause(150)
            } else {
                basic.showIcon(IconNames.ArrowNorthEast)
                serial.writeValue("starklinksLenken", abweichung)
                maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 0)
                basic.pause(100)
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
    serial.writeValue("zu weit links", -1)
    zeigeWeitRechts()
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(100)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
    basic.pause(200)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, tempo)
    basic.pause(80)
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
    basic.pause(5)
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
        serial.writeValue("Laenge", laenge)
        if (xZiel < 120 || xStart < 100) {
            zurueckVonRechts()
        } else if (xZiel > 180 || xStart > 200) {
            zurueckVonLinks()
        }
        berechneALR()
        if (richtung < 0) {
            linksLenken()
        } else {
            rechtsLenken()
        }
    } else {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, 0)
        basic.showIcon(IconNames.Square)
    }
})
