import adafruit_dht
import board
from smbus2 import SMBus

dhtDevice = adafruit_dht.DHT11(board.D26) # For humidity 

# I2C address of PCF8591
PCF8591_ADDRESS = 0x48

# Initialize I2C bus
bus = SMBus(1)

def read_moisture():
    # Read analog value from AIN0
    bus.write_byte(PCF8591_ADDRESS, 0x40)  # Set channel to AIN0
    bus.read_byte(PCF8591_ADDRESS)  # Dummy read to initialize
    moisture_level = bus.read_byte(PCF8591_ADDRESS)  # Read the actual value
    return moisture_level

def get_humidity():
    humidity = dhtDevice.humidity
    print(humidity)

def get_moisture(): 
    moisture = read_moisture()
    print(moisture)
