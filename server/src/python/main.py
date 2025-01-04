# import Adafruit_DHT
# from smbus2 import SMBus
# from time import sleep

# # GPIO pins
# moisture_sensor_pin = 17

# # I2C address of the PCF8591
# PCF8591_ADDRESS = 0x48

# # Analog input channel for the moisture sensor
# AIN_CHANNEL = 0 

# # Humidity 
# humidity_sensor = Adafruit_DHT.DHT11
# humidity_pin = 4

# # Motor 

# bus = SMBus(1)

# def read_analog(channel):
#     assert 0 <= channel <= 3, "Channel must be 0, 1, 2, or 3"
#     bus.write_byte(PCF8591_ADDRESS, channel)
#     bus.read_byte(PCF8591_ADDRESS)
#     return bus.read_byte(PCF8591_ADDRESS)

# # moisture_sensor = Button(sensor_pin) # Uncomment this

# def get_moisture_digital(): 
#     if moisture_sensor_pin.is_pressed:
#         print(True) # Soil is dry
#     else:
#         print(False) # Soul is moist

# # Analog Moisture Sensor
# def get_moisture_analog():
#     moisture_level = read_analog(AIN_CHANNEL) # 0 - 255 0 - 1023
#     print(moisture_level) 


# def get_humidity():
#     humidity = Adafruit_DHT.read_retry(humidity_sensor, humidity_pin)
        
#     if humidity is not None:
#         print(humidity)

def get_moisture_analog(): 
    print(613.8)

def get_humidity(): 
    print(50)