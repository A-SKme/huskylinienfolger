def berechneALR():
    global xZiel, xStart, deltaX, deltaY, abweichung, laenge, richtung
    xZiel = huskylens.reade_arrow(1, Content2.X_TARGET)
    xStart = huskylens.reade_arrow(1, Content2.X_ORIGIN)
    serial.write_value("Ziel", xZiel)
    serial.write_value("start", xStart)
    deltaX = huskylens.reade_arrow(1, Content2.X_TARGET) - huskylens.reade_arrow(1, Content2.X_ORIGIN)
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
    while xStart < 150 or xZiel < 150:
        serial.write_value("zu weit rechts", 1)
        zeigeWeitLinks()
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        basic.pause(500)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 30)
        basic.pause(500)
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, tempo)
        basic.pause(80)
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        basic.pause(1000)
        serial.write_value("neue WErte", 0)
        berechneALR()
def rechtsLenken():
    if abweichung > 0.5:
        if abweichung < 1:
            basic.show_icon(IconNames.ARROW_WEST)
            serial.write_value("rechtsLenken", abweichung)
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
            basic.pause(150)
        else:
            basic.show_icon(IconNames.ARROW_NORTH_WEST)
            serial.write_value("starkrechtsLenken", abweichung)
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo)
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo - 20)
            basic.pause(200)
    else:
        basic.show_icon(IconNames.ARROW_SOUTH)
def linksLenken():
    if abweichung > 0.5:
        if abweichung < 1:
            basic.show_icon(IconNames.ARROW_EAST)
            serial.write_value("linkLenken", abweichung)
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
            basic.pause(150)
        else:
            basic.show_icon(IconNames.ARROW_NORTH_EAST)
            serial.write_value("starklinksLenken", abweichung)
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, tempo)
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, tempo - 20)
            basic.pause(200)
    else:
        basic.show_icon(IconNames.ARROW_SOUTH)
def zeigeWeitRechts():
    basic.show_leds("""
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        . . . . #
        """)
def zurueckVonLinks():
    while xStart > 200 or xZiel > 200:
        serial.write_value("zu weit links", -1)
        zeigeWeitRechts()
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        basic.pause(500)
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 30)
        basic.pause(500)
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, tempo)
        basic.pause(80)
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        basic.pause(1000)
        serial.write_value("neue WErte", 0)
        berechneALR()
richtung = 0
laenge = 0
abweichung = 0
deltaY = 0
deltaX = 0
xStart = 0
xZiel = 0
tempo = 0
tempo = 20
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
        zurueckVonRechts()
        zurueckVonLinks()
    else:
        maqueen.motor_run(maqueen.Motors.ALL, maqueen.Dir.CW, 0)
        basic.show_icon(IconNames.SQUARE)
basic.forever(on_forever)
