# from gpiozero import Motor

# motor = Motor(16, 20) # PINS

# def start_motor():
#     motor.forward()
#     # motor.value  speed apparently 

# def stop_motor():
#     motor.stop()

# def is_motor_active():
#     return motor.is_active

from datetime import datetime

now = datetime.now()

def start_motor():
    with open("start.txt", "w") as file:
        file.write(str(now))

def stop_motor():
    with open("stop.txt", "w") as file:
        file.write(str(now))