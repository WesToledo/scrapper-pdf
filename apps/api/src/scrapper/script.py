from pdf2image import convert_from_path
import boto3.session
from concurrent import futures
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from dotenv import load_dotenv
import sys
import numpy as np
import os
# python-dotenv

load_dotenv()
# KEYS_TO_DOWNLOAD =['3001117181-10-2023.pdf', '3001165684-11-2023.pdf', '3000055479-11-2023.pdf', '3001165684-10-2023.pdf', '3000055479-06-2023.pdf', '3001117181-07-2023.pdf', '3000055479-10-2023.pdf', '3000055479-07-2023.pdf', '3001165684-07-2023.pdf', '3000055479-09-2023.pdf', '3001165684-09-2023.pdf', '3001117181-08-2023.pdf', '3000055479-08-2023.pdf', '3001117181-09-2023.pdf', '3001117181-06-2023.pdf', '3001165684-08-2023.pdf', '3001117181-11-2023.pdf', '3001165684-06-2023.pdf'] # all the files that you want to download
KEYS_TO_DOWNLOAD = ['3001117181-10-2023.pdf', '3001165684-11-2023.pdf']
# KEYS_TO_DOWNLOAD = np.array([])
BUCKET_NAME = "desafio-scrapper"

DOWNLOAD_PDF_PATH = "./src/scrapper/pdf/"
DOWNLOAD_IMG_PATH = "./src/scrapper/img/"
DOWNLOAD_SUCCESS = 'success'

DOWNLOADED_IMG_FILES_PATHS = []

# Dowload object from s3


def download_s3_object(s3_client, file_name):
    download_path = Path(DOWNLOAD_PDF_PATH) / file_name

    print(f"Downloading '{file_name}' to: {download_path} ...")

    s3_client.download_file(
        BUCKET_NAME,
        file_name,
        str(download_path)
    )
    return DOWNLOAD_SUCCESS


# Download many PDFs at the same time
def download_parallel_multithreading():
    session = boto3.session.Session()
    s3_client = session.client("s3")

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


def convert_pdf_to_image(file_path, file_name):
    pdf_pages_images = convert_from_path(file_path)

    img_path = DOWNLOAD_IMG_PATH + file_name + '.png'
    pdf_pages_images[0].save(img_path, 'PNG')

    DOWNLOADED_IMG_FILES_PATHS.append(img_path)


def main():

    # download of all uploaded pfd files from s3
    for key, result in download_parallel_multithreading():

        print("result", result)

        if (result == DOWNLOAD_SUCCESS):
            print(
                f"Downloaded {key} to: {DOWNLOAD_PDF_PATH + key} successfully")

            convert_pdf_to_image(DOWNLOAD_PDF_PATH + key, key)

    print(DOWNLOADED_IMG_FILES_PATHS)


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


if __name__ == "__main__":

    # lines = read_in()
    # KEYS_TO_DOWNLOAD = lines

    print('to download', KEYS_TO_DOWNLOAD)
    
    if not os.path.exists(DOWNLOAD_PDF_PATH):
        os.makedirs(DOWNLOAD_PDF_PATH)
    if not os.path.exists(DOWNLOAD_IMG_PATH):
        os.makedirs(DOWNLOAD_IMG_PATH)

    main()
