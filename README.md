# Smart Attendance System

A smart attendance tracking system built using an ESP32, RFID RC522, and OLED display.  
The system connects to a Next.js web application through Wi-Fi and stores attendance records in an SQLite database.

---

## Features

- RFID-based attendance tracking
- ESP32 Wi-Fi connectivity
- OLED display for real-time status
- Next.js web dashboard
- SQLite database integration
- Real-time attendance logging
- User management system
- Fast and lightweight setup

---

## Hardware Components

- ESP32
- RFID RC522 Module
- OLED Display (I2C)
- RFID Cards / Tags
- Jumper Wires
- Breadboard / PCB

---

## Tech Stack

### Embedded System
- Arduino Framework
- ESP32
- MFRC522 Library
- Adafruit SSD1306
- WiFi Library

### Web Application
- Next.js
- TypeScript
- SQLite
- REST API

---

## System Flow

```text
RFID Card
   ↓
RC522 Reader
   ↓
ESP32
   ↓ Wi-Fi
Next.js API
   ↓
SQLite Database
   ↓
Dashboard
```

---

## How It Works

1. User scans RFID card
2. ESP32 reads card UID
3. OLED display shows status
4. ESP32 sends data to the Next.js API
5. API stores attendance in SQLite database
6. Attendance appears on dashboard

---

## Wiring

### RC522 to ESP32

| RC522 | ESP32 |
|------|------|
| SDA | GPIO 5 |
| SCK | GPIO 18 |
| MOSI | GPIO 23 |
| MISO | GPIO 19 |
| RST | GPIO 22 |
| GND | GND |
| 3.3V | 3.3V |

### OLED Display

| OLED | ESP32 |
|------|------|
| SDA | GPIO 21 |
| SCL | GPIO 22 |
| VCC | 3.3V |
| GND | GND |

---

## Installation

### ESP32 Setup

Install required libraries in Arduino IDE:

- MFRC522
- Adafruit SSD1306
- Adafruit GFX
- WiFi

Configure Wi-Fi credentials:

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
```

Upload the code to the ESP32.

---

### Next.js Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/smart-attendance-system.git
cd smart-attendance-system
```

Install dependencies:

```bash
npm install
```

Initialize the database:

```bash
npm run db:init
```

Run the development server:

```bash
npm run dev
```

---

## API Example

### POST Attendance

```http
POST /api/attendance
```

Request Body:

```json
{
  "uid": "A1B2C3D4",
  "timestamp": "2026-05-09T10:00:00Z"
}
```

---

## OLED Status Messages

| Message | Description |
|------|------|
| Connecting WiFi... | Connecting to network |
| Scan Card | Waiting for RFID scan |
| Access Granted | Attendance recorded |
| Access Denied | Unknown RFID card |
| Upload Failed | API or database error |

---

## Future Improvements

- Authentication system
- Cloud database support
- Mobile application
- Analytics dashboard
- Student profile management
- Notifications system

---

## Screenshots

Add screenshots here:

- Hardware setup
- OLED display
- Dashboard
- Attendance logs

---

## License

This project is licensed under the MIT License.

---

## Author

Made by Mohamed Chafik
