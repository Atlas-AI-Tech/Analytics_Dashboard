"""Dummy flow processing metrics for local development and testing.

These records mimic the payload returned by the `/verification/flows/metrics`
endpoint so the UI can fetch latency data without relying on live services.
"""

from __future__ import annotations

from typing import Dict, List, TypedDict


class Timings(TypedDict, total=False):
    fileUploadTime: int
    grayScalingTime: int
    sageAPITime: int
    filePixelConversion: int
    reduct: int
    lentraAuth: int
    callbackSuccess: int
    miscellaneous: int


class ProcessingMetric(TypedDict, total=False):
    fileId: str
    docType: str
    fileUploadTimeIST: str
    totalTimeTaken: int
    timings: Timings


FLOW_METRICS: Dict[str, List[ProcessingMetric]] = {
    "FLOW_91FD4C31": [
        {
            "fileId": "FILE_4B1E9102",
            "docType": "PAN",
            "fileUploadTimeIST": "2025-11-12T09:42:15+05:30",
            "totalTimeTaken": 4820,
            "timings": {
                "fileUploadTime": 640,
                "grayScalingTime": 870,
                "sageAPITime": 1520,
                "filePixelConversion": 410,
                "reduct": 380,
                "lentraAuth": 620,
                "callbackSuccess": 260,
                "miscellaneous": 120,
            },
        },
        {
            "fileId": "FILE_2AB01F44",
            "docType": "BANK_STATEMENT",
            "fileUploadTimeIST": "2025-11-12T09:44:02+05:30",
            "totalTimeTaken": 5635,
            "timings": {
                "fileUploadTime": 710,
                "grayScalingTime": 940,
                "sageAPITime": 1890,
                "filePixelConversion": 520,
                "reduct": 455,
                "lentraAuth": 760,
                "callbackSuccess": 300,
                "miscellaneous": 60,
            },
        },
    ],
    "FLOW_3AA7F9BE": [
        {
            "fileId": "FILE_7CD91AE0",
            "docType": "AADHAAR",
            "fileUploadTimeIST": "2025-11-11T18:11:45+05:30",
            "totalTimeTaken": 4265,
            "timings": {
                "fileUploadTime": 520,
                "grayScalingTime": 780,
                "sageAPITime": 1375,
                "filePixelConversion": 365,
                "reduct": 330,
                "lentraAuth": 520,
                "callbackSuccess": 250,
                "miscellaneous": 125,
            },
        },
        {
            "fileId": "FILE_1E4F8C30",
            "docType": "GST_CERT",
            "fileUploadTimeIST": "2025-11-11T18:16:27+05:30",
            "totalTimeTaken": 6120,
            "timings": {
                "fileUploadTime": 760,
                "grayScalingTime": 1040,
                "sageAPITime": 2130,
                "filePixelConversion": 600,
                "reduct": 520,
                "lentraAuth": 690,
                "callbackSuccess": 310,
                "miscellaneous": 70,
            },
        },
    ],
    "FLOW_58D0B247": [
        {
            "fileId": "FILE_EF4A21B9",
            "docType": "SALE_DEED",
            "fileUploadTimeIST": "2025-11-10T14:03:08+05:30",
            "totalTimeTaken": 7325,
            "timings": {
                "fileUploadTime": 910,
                "grayScalingTime": 1260,
                "sageAPITime": 2480,
                "filePixelConversion": 780,
                "reduct": 690,
                "lentraAuth": 890,
                "callbackSuccess": 240,
                "miscellaneous": 75,
            },
        },
        {
            "fileId": "FILE_9A5D2304",
            "docType": "PURCHASE_ORDER",
            "fileUploadTimeIST": "2025-11-10T14:09:32+05:30",
            "totalTimeTaken": 5150,
            "timings": {
                "fileUploadTime": 640,
                "grayScalingTime": 890,
                "sageAPITime": 1690,
                "filePixelConversion": 480,
                "reduct": 440,
                "lentraAuth": 650,
                "callbackSuccess": 260,
                "miscellaneous": 100,
            },
        },
    ],
    "FLOW_F4E28AC9": [
        {
            "fileId": "FILE_6C3B08D7",
            "docType": "EBILL",
            "fileUploadTimeIST": "2025-11-09T21:51:12+05:30",
            "totalTimeTaken": 3980,
            "timings": {
                "fileUploadTime": 480,
                "grayScalingTime": 710,
                "sageAPITime": 1240,
                "filePixelConversion": 330,
                "reduct": 295,
                "lentraAuth": 540,
                "callbackSuccess": 255,
                "miscellaneous": 130,
            },
        },
        {
            "fileId": "FILE_4D7B6102",
            "docType": "ACH_FORM",
            "fileUploadTimeIST": "2025-11-09T21:53:40+05:30",
            "totalTimeTaken": 4520,
            "timings": {
                "fileUploadTime": 540,
                "grayScalingTime": 820,
                "sageAPITime": 1430,
                "filePixelConversion": 360,
                "reduct": 325,
                "lentraAuth": 590,
                "callbackSuccess": 280,
                "miscellaneous": 175,
            },
        },
    ],
}

__all__ = ["FLOW_METRICS"]

