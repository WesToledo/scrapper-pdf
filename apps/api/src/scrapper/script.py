from pdf2image import convert_from_path
import cv2
import sys
import easyocr
import json
import os

PDFS_PATH = "./src/arquives/"
IMAGES_PATH = "./src/scrapper/img/"

FILES = [
    # [
    #   0 -> pdf_path,
    #   1 -> img_path
    #   2 -> pdf_name
    #   3 -> result_ocr
    # ]
]

reader = easyocr.Reader(['pt'], gpu=True)


def find_image_containers(img):

    IMAGE_CONTAINERS = []

    header_container = img[130:460, :]
    body_container = img[460:, :]

    # Existe uma ligeira diferença entre certas faturas, que faziam com que
    # a ordem dos contornos fosse diferente. Optou-se por manualmente cortar a imagem na seção certa
    container_0 = header_container[:, :670]
    container_1 = header_container[:, 670:]

    # tratamento da imagem
    blur = cv2.GaussianBlur(body_container, (7, 7), 0)
    gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # procura os contornos da imagem
    contours = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    contours = contours[0] if len(contours) == 2 else contours[1]

    # sort do maior contorno(maior area) ao menor
    sorted_contours_by_size = sorted(
        contours, key=cv2.contourArea, reverse=True)[:13]

    del sorted_contours_by_size[8]

    # organiza os containers sequencialmente TOP_TO_BOTTOM and LEFT_TO_RIGHT
    contours, boundingBoxes = sort_contours_by_position(
        sorted_contours_by_size, x_axis_sort='LEFT_TO_RIGHT', y_axis_sort='TOP_TO_BOTTOM')

    IMAGE_CONTAINERS.append(container_0)
    IMAGE_CONTAINERS.append(container_1)

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        IMAGE_CONTAINERS.append(body_container[y:y+h, x:x+w])

    return IMAGE_CONTAINERS


def sort_contours_by_position(contours, x_axis_sort='LEFT_TO_RIGHT', y_axis_sort='TOP_TO_BOTTOM'):
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


def find_data_container_0(img):
    height, _, _ = img.shape

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


def convert_pdf_to_image(pdf_names):
    for pdf_name in pdf_names:

        pdf_path = f"{PDFS_PATH}{pdf_name}"
        image_path = f"{IMAGES_PATH}{pdf_name}.jpg"

        image = convert_from_path(pdf_path)[0]
        image.save(image_path, 'JPEG')

        file_info = [
            pdf_path,
            image_path,
            pdf_name
        ]

        FILES.append(file_info)


def get_data_from_image(img):

    IMAGE_CONTAINERS = find_image_containers(img)

    container_0 = find_data_container_0(IMAGE_CONTAINERS[0])
    container_1 = find_data_container_1(IMAGE_CONTAINERS[1])
    container_3 = find_data_container_3(IMAGE_CONTAINERS[3])

    response = {**container_0, **container_1, **container_3}

    return response


if __name__ == "__main__":

    # recebe os nomes dos arquivos recebidos do cliente enviados pelo PythonShell
    pdf_names = json.loads(sys.argv[1])

    # converte os PDF em imagens PIL
    convert_pdf_to_image(pdf_names)

    RESPONSE = []

    for index, file in enumerate(FILES):
        img = cv2.imread(file[1])

        image_data = get_data_from_image(img)

        data = {
            "pdf_path": file[0],
            "img_path": file[1],
            "pdf_name": file[2],
            "result": image_data,
        }

        # remove imagem criada do file system
        os.remove(file[1])

        RESPONSE.append(data)

    print(json.dumps(RESPONSE))

    # TO-DO : se alguma analise falhar, usar esse arquivo gerado para saber qual
    # pdf deixou de ser analisado
    with open('data.json', 'w') as f:
        json.dump(data, f)
