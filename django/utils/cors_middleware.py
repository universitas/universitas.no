class AllowCorsMiddleware:
    """Allow origin * for http requests"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['Access-Control-Allow-Origin'
                 ] = 'https://haakenlid.static.observableusercontent.com'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
