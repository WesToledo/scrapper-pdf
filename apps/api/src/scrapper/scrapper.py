from pdf2image import convert_from_path
import boto3.session
from concurrent import futures
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from dotenv import load_dotenv
import os
import numpy as np
from pdf2image import convert_from_path, convert_from_bytes
import cv2
from pytesseract import Output
import sys
import easyocr
import json
# python-dotenv

load_dotenv()
# KEYS_TO_DOWNLOAD = ['3001117181-10-2023.pdf', '3001165684-11-2023.pdf', '3000055479-11-2023.pdf', '3001165684-10-2023.pdf', '3000055479-06-2023.pdf', '3001117181-07-2023.pdf', '3000055479-10-2023.pdf', '3000055479-07-2023.pdf', '3001165684-07-2023.pdf',
# '3000055479-09-2023.pdf', '3001165684-09-2023.pdf', '3001117181-08-2023.pdf', '3000055479-08-2023.pdf', '3001117181-09-2023.pdf', '3001117181-06-2023.pdf', '3001165684-08-2023.pdf', '3001117181-11-2023.pdf', '3001165684-06-2023.pdf']  # all the files that you want to download
# KEYS_TO_DOWNLOAD = ['3001165684-11-2023.pdf']
# IMG_TO_DOWNLOAD = ['./img/3001117181-10-2023.png',
#    './img/3001165684-11-2023.png',]

KEYS_TO_DOWNLOAD = []
BUCKET_NAME = "desafio-scrapper"

DOWNLOAD_PDF_PATH = "./pdf/"
DOWNLOAD_IMG_PATH = "./img/"
DOWNLOAD_SUCCESS = 'success'

DOWNLOADED_IMG_FILES_PATHS = []

# Dowload object from s3

reader = easyocr.Reader(['pt'], gpu=True)


def download_files():

    def download_s3_object(s3_client, file_name):

        print(
            f"Downloading '{file_name}' to: {DOWNLOAD_IMG_PATH + file_name} ...")

        # s3_client.download_file(
        #     BUCKET_NAME,
        #     file_name,
        #     str(download_path)
        # )

        # download do pdf do bucket
        obj = s3_client.Object(BUCKET_NAME, file_name)

        # lê o arquivo como  bytes
        pdf_bytes = obj.get()['Body'].read()

        # convert pdf bytes numa lista de imagens
        img = convert_from_bytes(pdf_bytes)

        img_file_name = DOWNLOAD_IMG_PATH + \
            os.path.splitext(file_name)[0] + ".png"

        # salva localmente a imagem
        img[0].save(img_file_name, 'PNG')

        DOWNLOADED_IMG_FILES_PATHS.append(img_file_name)

        return DOWNLOAD_SUCCESS

    # Download varios arquivos "simultaneamente"
    def download_parallel_multithreading():
        session = boto3.session.Session()
        s3_client = session.resource("s3")

        # Dispatch work tasks with our s3_client
        with ThreadPoolExecutor(max_workers=8) as executor:
            future_to_key = {executor.submit(
                download_s3_object, s3_client, key): key for key in KEYS_TO_DOWNLOAD}

            for future in futures.as_completed(future_to_key):
                key = future_to_key[future]
                exception = future.exception()

                if not exception:
                    yield key, future.result()
                else:
                    yield key, exception

    for key, result in download_parallel_multithreading():
        if (result == DOWNLOAD_SUCCESS):
            print(
                f"Downloaded {key} to: {DOWNLOAD_PDF_PATH + key} successfully")
        else:
            print(f"Error to download {key}: {result}")

    print(DOWNLOADED_IMG_FILES_PATHS)


def sort_contours_by_position(contours, x_axis_sort='LEFT_TO_RIGHT', y_axis_sort='TOP_TO_BOTTOM'):
    # initialize the reverse flag
    x_reverse = False
    y_reverse = False
    if x_axis_sort == 'RIGHT_TO_LEFT':
        x_reverse = True
    if y_axis_sort == 'BOTTOM_TO_TOP':
        y_reverse = True

    boundingBoxes = [cv2.boundingRect(c) for c in contours]

    # sorting on x-axis
    sortedByX = zip(*sorted(zip(contours, boundingBoxes),
                            key=lambda b: b[1][0], reverse=x_reverse))

    # sorting on y-axis
    (contours, boundingBoxes) = zip(*sorted(zip(*sortedByX),
                                            key=lambda b: b[1][1], reverse=y_reverse))
    # return the list of sorted contours and bounding boxes
    return (contours, boundingBoxes)


def find_image_containers(img):

    IMAGE_CONTAINERS = []

    header_container = img[130:460, :]
    body_container = img[460:, :]

    container_0 = header_container[:, :670]
    container_1 = header_container[:, 670:]

    # blur = cv2.pyrMeanShiftFiltering(image, 11, 21)
    blur = cv2.GaussianBlur(body_container, (7, 7), 0)
    gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # thresh = cv2.adaptiveThreshold(gray, 255,
    #                                cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 4)

    contours = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    contours = contours[0] if len(contours) == 2 else contours[1]

    # do maior contorno ao menor
    sorted_contours_by_size = sorted(
        contours, key=cv2.contourArea, reverse=True)[:13]

    del sorted_contours_by_size[8]

    cv2.drawContours(
        body_container, sorted_contours_by_size, -1, (0, 255, 0), 3)

    # resized = cv2.resize(body_container, [500, 940])
    # cv2.imshow("resized", resized)
    # cv2.waitKey()

    contours, boundingBoxes = sort_contours_by_position(
        sorted_contours_by_size, x_axis_sort='LEFT_TO_RIGHT', y_axis_sort='TOP_TO_BOTTOM')

    IMAGE_CONTAINERS.append(container_0)
    IMAGE_CONTAINERS.append(container_1)

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        IMAGE_CONTAINERS.append(body_container[y:y+h, x:x+w])

    return IMAGE_CONTAINERS


def find_data_container_0(img):
    height, _, _ = img.shape

    # cv2.imshow("container 0", img)
    # cv2.waitKey()

    cropped = img[height//2:, :]

    lines = reader.readtext(cropped)

    texts = []
    for line in lines:
        _, text, _ = line
        texts.append(text)

    return {"numero_cliente": texts[2], "numero_instalacao": texts[3]}


def find_data_container_1(img):

    cropped = img[:80, :230]
    lines = reader.readtext(cropped)

    texts = []
    for line in lines:
        _, text, _ = line
        texts.append(text)

    return {"referente": texts[1]}


def find_data_container_3(img):

    cropped = img[80:230, :]

    lines = reader.readtext(cropped)

    texts = []
    for line in lines:
        _, text, _ = line
        texts.append(text)
    energia_eletrica = texts[:6]
    energia_SCEE = texts[6:12]
    energia_compensada = texts[12:18]
    iluminacao_publica = texts[18:20]
    total = texts[20:]

    return {"energia_eletrica": {
        "quantidade": energia_eletrica[2],
        "valor": energia_eletrica[4],
    },
        "energia_SCEE": {
        "quantidade": energia_SCEE[2],
        "valor": energia_SCEE[4],
    },
        "energia_compensada": {
        "quantidade": energia_compensada[2],
        "valor": energia_compensada[4],
    },
        "iluminacao_publica": {
        "valor": iluminacao_publica[1],
    },
    }


def main():

    # KEYS_TO_DOWNLOAD = json.loads(sys.argv[1])
    
    download_files()

    RESPONSE_DATA = []

    images = [cv2.imread(img_path) for img_path in DOWNLOADED_IMG_FILES_PATHS]

    for index, img in enumerate(images):

        print(f"{index} - Analising...")

        IMAGE_CONTAINERS = find_image_containers(img)

        container_0 = find_data_container_0(IMAGE_CONTAINERS[0])
        container_1 = find_data_container_1(IMAGE_CONTAINERS[1])
        container_3 = find_data_container_3(IMAGE_CONTAINERS[3])

        response = {**container_0, **container_1, **container_3}

        print(f"{index} - DONE !")

        RESPONSE_DATA.append(response)

    # with open("response.txt", "w") as fp:
    #     json.dump(RESPONSE_DATA, fp)


if __name__ == "__main__":
    main()
