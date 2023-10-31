from flask import make_response

def response(status_code, body = None):
    response_body = {
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": body,
        "isBase64Encoded": False,
    }
    return make_response(response_body, status_code)