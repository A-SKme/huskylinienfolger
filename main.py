def berechneALR():
    global xZiel, xStart, deltaX, deltaY, abweichung, laenge, richtung
    xZiel = huskylens.reade_arrow(1, Content2.X_TARGET)
    xStart = huskylens.reade_arrow(1, Content2.X_ORIGIN)
    serial.write_value("Ziel", xZiel)
    serial.write_value("start", xStart)
    deltaX = xZiel - xStart
    deltaY = huskylens.reade_arrow(1, Content2.Y_TARGET) - huskylens.reade_arrow(1, Content2.Y_ORIGIN)
    if abs(deltaX) < 0.001:
        abweichung = 0
    else:
        if abs(deltaY) < 0.001:
            deltaY = 0.001
        abweichung = 10 * abs(deltaX) / abs(deltaY)
    laenge = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if deltaX < 0:
        richtung = -1
    else:
        richtung = 1
def zeigeWeitLinks():
    basic.show_leds("""
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        # . . . .
        """)
def zurueckVonRechts():
    zeigeWeitLinks()
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
    basic.pause(50)
    maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 15)
    maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
    basic.pause(250)
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, tempo)
    basic.pause(50)
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
    basic.pause(50)
def rechtsLenken():
    if laenge < 60:
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        basic.pause(200)
    else:
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        if abweichung > 0.5:
            if abweichung < 1.8:
                basic.show_icon(IconNames.ARROW_WEST)
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 5)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
                basic.pause(150)
            else:
                basic.show_icon(IconNames.ARROW_NORTH_WEST)
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 15)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
                basic.pause(200)
        else:
            basic.show_icon(IconNames.ARROW_SOUTH)
            maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, tempo)
            basic.pause(200)
def linksLenken():
    if laenge < 60:
        serial.write_value("GANZLINKS", abweichung)
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 0)
    else:
        if abweichung > 0.5:
            if abweichung < 1.8:
                maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
                basic.show_icon(IconNames.ARROW_EAST)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 5)
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
                basic.pause(150)
            else:
                basic.show_icon(IconNames.ARROW_NORTH_EAST)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo + 15)
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
                basic.pause(200)
        else:
            basic.show_icon(IconNames.ARROW_SOUTH)
            maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, tempo)
            basic.pause(200)
def zeigeWeitRechts():
    basic.show_leds("""
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        """)
def zurueckVonLinks():
    zeigeWeitRechts()
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
    basic.pause(50)
    maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo + 5)
    maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
    basic.pause(250)
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, tempo)
    basic.pause(50)
    maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
    basic.pause(50)
richtung = 0
laenge = 0
abweichung = 0
deltaX = 0
deltaY = 0
xZiel = 0
xStart = 0
tempo = 0
tempo = 25
xStart = 0
xZiel = 0
deltaY = 0
deltaY = 0
maqueen.write_led(maqueen.Led.LED_ALL, maqueen.LedSwitch.LED_ON)
basic.show_icon(IconNames.HEART, 600)
huskylens.init_i2c()
huskylens.init_mode(protocolAlgorithm.ALGORITHM_LINE_TRACKING)
huskylens.write_name(1, "orange")
basic.show_icon(IconNames.YES)

def on_forever():
    huskylens.request()
    if huskylens.is_appear(1, HUSKYLENSResultType_t.HUSKYLENS_RESULT_ARROW):
        berechneALR()
        if abs((xZiel + xStart) / 2) < 120 or abs((xZiel + xStart) / 2) > 180:
            if abs((xZiel + xStart) / 2) < 120:
                serial.write_value("zu weit von Mitte", abs((xZiel - xStart) / 2))
                zurueckVonRechts()
            elif abs((xZiel + xStart) / 2) > 180:
                zurueckVonLinks()
        else:
            if richtung < 0:
                linksLenken()
            else:
                rechtsLenken()
    else:
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        basic.show_icon(IconNames.SQUARE)
basic.forever(on_forever)
