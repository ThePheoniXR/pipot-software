from gpiozero import Motor
import time
import signal
import sys

motor = Motor(16, 20)  # PINS
motor_running = False

def start_motor():
    global motor_running
    motor_running = True
    while motor_running:
        motor.forward()
        time.sleep(1)  # Control loop delay

def stop_motor():
    global motor_running
    motor_running = False
    motor.stop()

def is_motor_active():
    return motor_running

def handle_signal(signal, frame):
    stop_motor()
    sys.exit(0)

signal.signal(signal.SIGINT, handle_signal)

# from datetime import datetime

# now = datetime.now()

# def start_motor():
#     with open("start.txt", "w") as file:
#         file.write(str(now))

# def stop_motor():
#     with open("stop.txt", "w") as file:
#         file.write(str(now))

# if __name__ == "__main__":
#     start_motor()