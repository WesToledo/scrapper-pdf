# Scrapper PDF

The main goal of this project was to create an simple scraper to extract some relevant data from PDF electric bills, save the extracted data in a database after parsing and show it in a WEB dashboard using **Python, React, NodeJS and Typescript**.

The scraper is written in Python, using OpenCV library to manipulate and treat images and EasyOCR for the text recognition.

The data chosen to be extracted were the following:

- Número do Cliente
- Mês de referência
- Energia Elétrica – Quantidade (kWh) e Valor (R$)
- Energia SCEEE s/ICMS – Quantidade (kWh) e Valor (R$)
- Energia Compensada GDI – Quantidade (kWh) e Valor (R$)
- Contrib Ilum Publica Municipal – Valor (R$)

## Scraper

### Installation

Use [pip](https://pip.pypa.io/en/stable/) to install.

```bash
pip install opencv-python
pip install pdf2image
pip install easyocr

# If you receive an error when running the script, try downgrading the PIL and matplotlib  
pip install --ignore-installed Pillow==9.3.0
pip install matplotlib==3.7.1

```

### How it's done

To retrieve data from the PDF files, the script utilizes the **pdf2image** library to parse the PDF into a PIL Image. Subsequently, it employs OpenCV to identify the contours of information blocks in each file, dividing them into containers numbered from 0 to 13 (refer to the image below). As each container contains distinct information and exhibits different font sizes and styles, the script analyzes each one separately to extract the corresponding data.

The script is triggered when the **/upload** route is accessed. The server stores the received PDF files locally and then, using **PythonShell**, passes the file paths to the Python script. It expects receiving a JSON object containing the extracted data after parsing.

The PDF files are then uploaded to an AWS S3 bucket, and the extracted data is stored in a PostgreSQL database.


![Alt text](/assets/fatura_boundaries.png)

## Project Instalation

This project is a Monorepo built using TurboRepo. The **/api** has an NestJS project and the **/client** an Vite project using React + typescript.

Install with **npm**

```bash
  npm install

  # Docker compose
  npm run start:services   

  # Dev Mode
  npm run dev
```


## Testing

Download the PDF bills for testing here: [Faturas](/assets/FATURAS.zip)
