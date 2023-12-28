# Desafio Scrapper

## Scrapper

A biblioteca de Visão Computacional escolhida foi o OpenCV. O OCR usado foi o EasyOCR.

### Instalação

Use [pip](https://pip.pypa.io/en/stable/) para instalar as dependências.

```bash
pip install cv2
pip install pdf2image
pip install dotenv
pip install

# Para instalar o EasyOCR seguir instalação de deps no site oficial
pip install easyocr
```

### OPENCV e EasyOCR

Com OPENCV se recupera o contorno dos blocos de informação dentro da fatura, e são divididos em container. Cada qual analisado separado a depender da informação a ser obtida. Para os desafio somente os items obrigatórios foram recuperados.

O Script python é invocado quando o usuário acessa a rota de /upload e envia faturas PDF. Ele recupera os dados de cada fatura e a fatura é salva num bucket S3.

![Alt text](/assets/fatura_boundaries.png)

## Instalação Node

Esse projeto é um Monorepo usando TurboRepo. A pasta /api contém um projeto Nestjs e a pasta /client um projeto Vite em React + Typescript.

Instale com npm

```bash
  #Instala as dependências
  npm install

  # Docker compose
  npm run start:services

  # Modo dev
  npm run dev
```
